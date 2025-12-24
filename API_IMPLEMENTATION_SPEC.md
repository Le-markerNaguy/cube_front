# API Implementation Specification (required by frontend)

This document lists every HTTP route the frontend calls (from `lib/api.ts`) and the exact request / response shapes and fields the backend must implement so the frontend features (including RBAC) work correctly. Also included: RBAC notes and error behavior (403 handling).

---

## Global notes
- Base path prefix: configurable (frontend uses `NEXT_PUBLIC_API_URL` or `/api`).
- All endpoints return a common wrapper JSON (used by `apiRequest` helper):
  - On success: { success: true, data: <payload>, message?: string }
  - On error:  { success: false, error: "<message>" }
  - 403 responses should cause `error: "Accès refusé (403)"` on the frontend; backend must return HTTP 403 when appropriate.
- Authentication: Bearer token via `Authorization: Bearer <token>` header.
- RBAC contract: backend must return `role` and `permissions` in auth responses or in `/auth/profile`.

---

## 1) AUTH

### POST /auth/login
Request body:
- telephone: string
- mot_de_passe: string

Response (200):
- token: string
- client: {
  id, nom_complet, telephone, email?, date_inscription (ISO string), role?: string, permissions?: string[]
}

Notes:
- Permissions list should be an array of permission keys (e.g., `"orders.preparation.update"`).

---

### POST /auth/register
Request body:
- nom_complet, telephone, email?, mot_de_passe

Response: same shape as /auth/login (token + client)

---

### POST /auth/logout
Request: none (uses token)
Response: success boolean

---

### GET /auth/profile
Request: Authorization header
Response data: client object (same as login's client) — MUST include optional `role` and `permissions` if user is admin.

---

### PATCH /auth/profile
Request body: partial client fields to update (name, telephone, email...)
Response: updated client

---

### POST /auth/forgot-password
Request body: { telephone }
Response: { message }

---

### POST /auth/reset-password
Request body: { token, mot_de_passe }

---

## 2) PLATS (dishes)

Endpoints required (frontend uses these):

- GET /plats?[filters]
  - Supports filters: type, categorie, statut, search, page, limit
  - Response: paginated list of PlatResponse (id, nom, description, type, prix_base, categorie, image?, statut, variations[], created_at, updated_at)

- GET /plats?type=menu&statut=actif (getMenu)
- GET /plats?type=base&statut=actif (getBases)
- GET /plats?type=accompagnement&statut=actif (getAccompagnements)
- GET /plats?type=supplement&statut=actif (getSupplements)

- GET /plats/:id
  - Response: single PlatResponse

- POST /plats (admin)
  - Request: PlatRequest (nom, description, type, prix_base, categorie, image?, statut?, variations?)
  - Response: created PlatResponse
  - Requires admin privileges (backend enforcement)

- PATCH /plats/:id
  - Body: partial PlatRequest
  - Response: updated PlatResponse

- DELETE /plats/:id
  - Response: success

- POST /plats/upload (file upload)
  - Accepts multipart/form-data file -> returns { url }

- GET /plats/popular?limit=n
  - Response: array of PlatResponse

- GET /plats/categories
  - Response: string[] categories


## 3) PANIER (cart)

- GET /panier
  - Response: { id, items: [...], sous_total, frais_livraison, tva, total }

- POST /panier/items
  - Body: PanierItem { id_plat, id_variation?, quantite, personnalisation? }
  - Response: updated PanierResponse

- PATCH /panier/items/:itemId
  - Body: { quantite }
  - Response: updated PanierResponse

- DELETE /panier/items/:itemId
  - Response: updated PanierResponse

- DELETE /panier
  - Clears cart

- POST /panier/promo
  - Body: { code }
  - Response: updated cart + { reduction }


## 4) COMMANDES (orders)

Frontend expectations:

- POST /commandes
  - Body (CommandeRequest): {
    adresse_livraison: string,
    ville: string,
    commune: string,
    instructions?: string,
    mode_paiement: "airtel_money" | "mobile_cash" | "livraison",
    montant_en_especes?: number, // IMPORTANT: frontend sends this when payment mode is livraison
    items: [ { id_plat, id_variation?, quantite, prix_unitaire, personnalisation? } ]
  }

  - Response: CommandeResponse with fields including: id, id_client, adresse_livraison, ville, commune, instructions?, statut_commande, date_commande, date_confirmation?, date_preparation?, date_depart_livraison?, date_livree?, lignes[], paiement: { id, mode, montant, statut, montant_en_especes? }, client summary, sous_total, frais_livraison, tva, total

  - Backend should persist `montant_en_especes` into payment or order meta for retrieval by admin and suivi pages

- GET /commandes (admin) — supports filters & pagination
  - Response: paginated CommandeResponse[]

- GET /commandes/mine
  - Response: user's CommandeResponse[]

- GET /commandes/:id
  - Response: CommandeResponse

- PATCH /commandes/:id/status
  - Body: { statut_commande: "en_preparation" | "en_livraison" | "livree" | ... }
  - Response: updated CommandeResponse
  - **RBAC**: backend MUST enforce permission checks server-side (e.g., only users with `orders.preparation.update` can set certain transitions). Return HTTP 403 when not allowed.

- POST /commandes/:id/cancel
  - Body: { raison?: string }
  - Response: updated CommandeResponse

- GET /commandes/stats?periode=jour|semaine|mois
  - Response: dashboard stats including `commandes_recentes` (array of CommandeResponse) used in admin dashboard

- GET /commandes/:id/track
  - Response: { statut, position_livreur?: { lat, lng }, temps_estime?: number }

Notes:
- `CommandeResponse.paiement` must include optional `montant_en_especes` when provided at creation.
- Status transitions must be validated server-side and may return 403 if unauthorized.


## 5) PAIEMENTS

- POST /paiements
  - Body: { id_commande, mode: 'airtel_money'|'mobile_cash'|'livraison', telephone? }
  - Response: PaiementResponse incl. { id, id_commande, mode, montant, statut, reference?, date_paiement?, redirect_url? }

- GET /paiements/:id/status
  - Response: PaiementResponse

- POST /paiements/:id/confirm
  - Body: { reference }
  - Response: PaiementResponse


## 6) ADMINS (Super Admin)

- GET /admins
  - Response: AdminResponse[] (id, nom, email, date_creation, role? (id or nested name), ...)

- GET /admins/:id
  - Response: AdminResponse

- POST /admins
  - Body: { name (nom), email?, password (mot_de_passe), role_id? }
  - Response: created AdminResponse

- PATCH /admins/:id
  - Body: { name?, email?, password?, role_id? }
  - Response: updated AdminResponse

- DELETE /admins/:id
  - Response: success

RBAC notes:
- Only superadmins or authorized users should be allowed to manage admins (server-side enforcement).


## 7) ROLES & PERMISSIONS (Super Admin)

- GET /permissions
  - Response: array of PermissionResponse { key, description? }

- GET /roles
  - Response: RoleResponse[] { id, name, permissions: string[] }

- GET /roles/:id
  - Response: RoleResponse

- POST /roles
  - Body: { name, permissions?: string[] }
  - Response: created RoleResponse

- PATCH /roles/:id
  - Body: { name?, permissions? }
  - Response: updated RoleResponse

- PUT /roles/:id/permissions
  - Body: { permissions: string[] }
  - Response: updated RoleResponse

- DELETE /roles/:id
  - Response: success

RBAC notes:
- Only `superadmin` or authorized users should be allowed to call these endpoints.


## 8) STATISTICS / ADMIN DASHBOARD

- GET /stats/dashboard
  - Response shape used by admin dashboard (see code):
    {
      commandes_jour: number,
      revenus_jour: number,
      plats_menu: number,
      inscriptions_mois: number,
      tendances: { commandes, revenus, plats, inscriptions },
      revenus_semaine: [{ jour, montant }],
      plats_populaires: [{ nom, commandes, pourcentage }],
      commandes_recentes: CommandeResponse[]
    }

- GET /stats/revenus?periode=jour|semaine|mois|annee
  - Response: { labels: string[], data: number[], total: number }

- GET /stats/top-plats?limit=n
  - Response: { plats: [{ id, nom, quantite, revenus }] }

- GET /stats/clients
  - Response: { total, nouveaux_semaine, nouveaux_mois, panier_moyen }

---

## CLIENTS (admin)

- GET /clients[?filters]
  - Filters: search, page, limit
  - Response: paginated list of ClientResponse { id, nom_complet, telephone, email?, date_inscription }

- GET /clients/:id
  - Response: ClientResponse { id, nom_complet, telephone, email?, date_inscription }

- GET /clients/stats
  - Response: { total, nouveaux_semaine, nouveaux_mois, actifs, panier_moyen }

Notes:
- Endpoints under `/clients` are intended for admin dashboards and must be protected by RBAC (e.g., require `admin.clients.view`).


## 9) PARAMÈTRES & COMMUNES

- GET /parametres
  - Response: ParametresRestaurant (name, adresse, paiement toggles etc.)

- PATCH /parametres
  - Body: partial ParametresRestaurant
  - Response: updated parametres

- GET /communes
  - Response: list of communes with frais_livraison


## 10) OTHER (CONTACT, PANIER PROMO, FILE UPLOADS)

- POST /contact
  - Body: { nom, email, telephone?, sujet, message }
  - Response: { message }

- POST /plats/upload
  - File upload endpoint returning { url }


---

## RBAC — permission keys (recommended list)
This is a suggestion of permission keys the backend should support so the frontend can check for them:

- admin.dashboard.view
- admin.roles.manage
- admin.admins.manage
- orders.read
- orders.update
- orders.preparation.update
- orders.livree.confirm
- orders.cancel
- payments.manage
- plats.manage
- stats.view
- settings.update

Note: `*` wildcard permission or `superadmin` role may be supported by the backend for full access.

---

## Error & Validation rules
- All endpoints must return 401 for invalid/expired tokens, 403 for permission denied, 400 for validation errors (with details), and 500 for server errors.
- For /commandes creation: validate required fields and that item prices/ids are valid; save `montant_en_especes` only when `mode_paiement` === `livraison` (but accept optional field if present).
- For status transitions: implement server-side state machine + enforce RBAC; return 403 if user lacks permission.

---

## Example snippets

POST /commandes request example

{
  "adresse_livraison": "123 rue",
  "ville": "Kinshasa",
  "commune": "Lemba",
  "instructions": "Sonner",
  "mode_paiement": "livraison",
  "montant_en_especes": 3500,
  "items": [
    { "id_plat": "pl_123", "id_variation": "v_1", "quantite": 2, "prix_unitaire": 2500 }
  ]
}

POST /commandes response example (success)

{
  "success": true,
  "data": {
    "id": "cmd_123",
    "id_client": "cl_1",
    "adresse_livraison": "123 rue",
    "ville": "Kinshasa",
    "commune": "Lemba",
    "instructions": "Sonner\nMontant en espèces annoncé: 3500f",
    "statut_commande": "en_attente",
    "date_commande": "2025-12-22T12:00:00Z",
    "lignes": [...],
    "paiement": { "id": "pay_1", "mode": "livraison", "montant": 3500, "montant_en_especes": 3500, "statut": "en_attente" },
    "sous_total": 5000,
    "frais_livraison": 300,
    "tva": 800,
    "total": 6100
  }
}

---

If you want, I can now:
- Generate an OpenAPI (Swagger) skeleton from this spec, or
- Create a `backend-mock` server (localhost) that implements these endpoints for frontend development.

Which do you prefer next?