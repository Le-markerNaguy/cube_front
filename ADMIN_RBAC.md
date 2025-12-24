# RBAC Frontend (SUPER-ADMIN / ADMIN)

Résumé des changements frontend réalisés :

## Types & Auth
- Ajout des types `Role` et `Permission` dans `lib/types.ts`.
- `Client` supporte désormais (optionnel) : `role?: string` et `permissions?: string[]`.
- `contexts/auth-context.tsx` expose maintenant : `role`, `permissions` et `hasPermission(permission: string)`.
- `authApi.login` / `authApi.getProfile` peuvent renvoyer `role` et `permissions` (présence côté backend nécessaire).

## Endpoints frontend ajoutés (`lib/api.ts`)
- `permissionsApi.getAll()` → GET `/permissions`
- `rolesApi` :
  - `getAll()` → GET `/roles`
  - `getById(id)` → GET `/roles/:id`
  - `create({ name, permissions })` → POST `/roles`
  - `update(id, { name, permissions })` → PATCH `/roles/:id`
  - `updatePermissions(id, permissions)` → PUT `/roles/:id/permissions`
  - `delete(id)` → DELETE `/roles/:id`
- `adminsApi.create/update` acceptent maintenant `role_id` pour assigner un rôle à un admin.

> Note: Ces routes sont appelées depuis le frontend, mais le backend doit les implémenter pour fonctionner. Si le backend renvoie `403`, le frontend gère l'affichage d'`Accès refusé`.

## Interfaces SUPER-ADMIN
- `app/admin/roles/page.tsx` : liste des rôles, permissions, éditeur par checkbox, sauvegarde.
- `app/admin/admins/page.tsx` : création / suppression d'admins, assignation de rôles.
- `components/admin/permission-checkboxes.tsx` : composant réutilisable pour afficher des permissions en checkbox.
- `components/admin/access-denied.tsx` : affichage propre pour accès refusé.

## Adaptation ADMIN
- `app/admin/commandes/page.tsx` : actions visibles selon permissions (`orders.preparation.update`, `orders.livree.confirm`).
- Lors d'une tentative d'action sans permission, un toast `Accès refusé` est affiché.

## Erreurs & UI
- `lib/api.ts` : si réponse HTTP 403, retoune `error: "Accès refusé (403)"` pour un handling uniforme.
- Utilisation de `use-toast` pour feedback utilisateur.

## Prochaines étapes / recommandations
- Implémenter côté backend les endpoints `/roles`, `/permissions` et la gestion `role_id` pour les admins.
- Ajouter tests E2E pour couvrir : création rôle, assignation permissions, tentatives d'action sans permissions (403).
- Ajouter page de détail d'admin (édition + changement de rôle).

Si tu veux, je peux maintenant :
- Ajouter des tests unitaires simples (Jest/RTL) pour les composants.
- Mettre en place l'UI d'assignation des permissions dans la page de détail d'un admin.
