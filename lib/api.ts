// ==========================================
// SERVICES API - CUBE Restaurant
// ==========================================
// Ce fichier contient tous les appels API du site
// Les endpoints sont prêts à être connectés à un backend réel

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// ==========================================
// TYPES POUR LES RÉPONSES API
// ==========================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ==========================================
// HELPER POUR LES APPELS API
// ==========================================

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Ajouter le token d'authentification si présent
  const token = typeof window !== "undefined" ? localStorage.getItem("cube_token") : null
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `Erreur ${response.status}`,
      }
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    return {
      success: false,
      error: "Erreur de connexion au serveur",
    }
  }
}

// ==========================================
// API AUTHENTIFICATION
// ==========================================

export interface LoginRequest {
  telephone: string
  mot_de_passe: string
}

export interface LoginResponse {
  token: string
  client: {
    id: string
    nom_complet: string
    telephone: string
    email?: string
    date_inscription: string
  }
}

export interface RegisterRequest {
  nom_complet: string
  telephone: string
  email?: string
  mot_de_passe: string
}

export const authApi = {
  // Connexion
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Inscription
  register: async (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Déconnexion
  logout: async (): Promise<ApiResponse<null>> => {
    return apiRequest<null>("/auth/logout", {
      method: "POST",
    })
  },

  // Récupérer le profil actuel
  getProfile: async (): Promise<ApiResponse<LoginResponse["client"]>> => {
    return apiRequest<LoginResponse["client"]>("/auth/profile")
  },

  // Mettre à jour le profil
  updateProfile: async (data: Partial<LoginResponse["client"]>): Promise<ApiResponse<LoginResponse["client"]>> => {
    return apiRequest<LoginResponse["client"]>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  // Mot de passe oublié
  forgotPassword: async (telephone: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ telephone }),
    })
  },

  // Réinitialiser le mot de passe
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, mot_de_passe: newPassword }),
    })
  },
}

// ==========================================
// API PLATS
// ==========================================

export interface PlatRequest {
  nom: string
  description: string
  type: "menu" | "base" | "accompagnement" | "supplement"
  prix_base: number
  categorie: string
  image?: string
  statut?: "actif" | "inactif"
  statut_stock?: "en_stock" | "stock_bas" | "rupture"
  variations?: {
    taille: "petit" | "moyen" | "grand"
    prix: number
  }[]
}

export interface PlatResponse {
  id: string
  nom: string
  description: string
  type: "menu" | "base" | "accompagnement" | "supplement"
  prix_base: number
  categorie: string
  image?: string
  statut: "actif" | "inactif"
  statut_stock: "en_stock" | "stock_bas" | "rupture"
  variations?: {
    id: string
    id_plat: string
    taille: "petit" | "moyen" | "grand"
    prix: number
  }[]
  created_at: string
  updated_at: string
}

export interface PlatsFilters {
  type?: string
  categorie?: string
  statut?: string
  statut_stock?: string
  search?: string
  page?: number
  limit?: number
}

export const platsApi = {
  // Récupérer tous les plats
  getAll: async (filters?: PlatsFilters): Promise<PaginatedResponse<PlatResponse>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString() ? `?${params.toString()}` : ""
    return apiRequest<PlatResponse[]>(`/plats${query}`) as Promise<PaginatedResponse<PlatResponse>>
  },

  // Récupérer les plats du menu
  getMenu: async (): Promise<ApiResponse<PlatResponse[]>> => {
    return apiRequest<PlatResponse[]>("/plats?type=menu&statut=actif")
  },

  // Récupérer les plats base (pour personnalisation)
  getBases: async (): Promise<ApiResponse<PlatResponse[]>> => {
    return apiRequest<PlatResponse[]>("/plats?type=base&statut=actif")
  },

  // Récupérer les accompagnements
  getAccompagnements: async (): Promise<ApiResponse<PlatResponse[]>> => {
    return apiRequest<PlatResponse[]>("/plats?type=accompagnement&statut=actif")
  },

  // Récupérer les suppléments
  getSupplements: async (): Promise<ApiResponse<PlatResponse[]>> => {
    return apiRequest<PlatResponse[]>("/plats?type=supplement&statut=actif")
  },

  // Récupérer un plat par ID
  getById: async (id: string): Promise<ApiResponse<PlatResponse>> => {
    return apiRequest<PlatResponse>(`/plats/${id}`)
  },

  // Créer un plat
  create: async (data: PlatRequest): Promise<ApiResponse<PlatResponse>> => {
    return apiRequest<PlatResponse>("/plats", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Mettre à jour un plat
  update: async (id: string, data: Partial<PlatRequest>): Promise<ApiResponse<PlatResponse>> => {
    return apiRequest<PlatResponse>(`/plats/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  // Supprimer un plat
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>(`/plats/${id}`, {
      method: "DELETE",
    })
  },

  // Upload d'image
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append("image", file)

    const token = typeof window !== "undefined" ? localStorage.getItem("cube_token") : null

    try {
      const response = await fetch(`${API_BASE_URL}/plats/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Erreur upload" }
      }

      return { success: true, data: { url: data.url } }
    } catch {
      return { success: false, error: "Erreur lors de l'upload" }
    }
  },

  // Récupérer les plats populaires
  getPopular: async (limit = 6): Promise<ApiResponse<PlatResponse[]>> => {
    return apiRequest<PlatResponse[]>(`/plats/popular?limit=${limit}`)
  },

  // Récupérer les catégories
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiRequest<string[]>("/plats/categories")
  },
}

// ==========================================
// API COMMANDES
// ==========================================

export interface CommandeItemRequest {
  id_plat: string
  id_variation?: string
  quantite: number
  prix_unitaire: number
  personnalisation?: {
    accompagnements: { id_plat: string; id_variation: string; quantite: number }[]
    supplements: { id_plat: string; id_variation: string; quantite: number }[]
  }
}

export interface CommandeRequest {
  adresse_livraison: string
  ville: string
  commune: string
  instructions?: string
  mode_paiement: "airtel_money" | "mobile_cash" | "livraison"
  items: CommandeItemRequest[]
}

export interface CommandeResponse {
  id: string
  id_client: string
  adresse_livraison: string
  ville: string
  commune: string
  instructions?: string
  statut_commande: "en_attente" | "confirmee" | "en_preparation" | "en_livraison" | "livree" | "annulee"
  date_commande: string
  date_confirmation?: string
  date_preparation?: string
  date_depart_livraison?: string
  date_livree?: string
  lignes: {
    id: string
    id_plat: string
    nom_plat: string
    image_plat?: string
    quantite: number
    prix_unitaire: number
    prix_total: number
    taille?: string
  }[]
  paiement: {
    id: string
    mode: "airtel_money" | "mobile_cash" | "livraison"
    montant: number
    statut: "en_attente" | "reussi" | "echoue"
  }
  client: {
    id: string
    nom_complet: string
    telephone: string
  }
  sous_total: number
  frais_livraison: number
  tva: number
  total: number
}

export interface CommandesFilters {
  statut?: string
  client_id?: string
  date_debut?: string
  date_fin?: string
  search?: string
  page?: number
  limit?: number
}

export const commandesApi = {
  // Récupérer toutes les commandes (admin)
  getAll: async (filters?: CommandesFilters): Promise<PaginatedResponse<CommandeResponse>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString() ? `?${params.toString()}` : ""
    return apiRequest<CommandeResponse[]>(`/commandes${query}`) as Promise<PaginatedResponse<CommandeResponse>>
  },

  // Récupérer les commandes du client connecté
  getMine: async (): Promise<ApiResponse<CommandeResponse[]>> => {
    return apiRequest<CommandeResponse[]>("/commandes/mine")
  },

  // Récupérer une commande par ID
  getById: async (id: string): Promise<ApiResponse<CommandeResponse>> => {
    return apiRequest<CommandeResponse>(`/commandes/${id}`)
  },

  // Créer une commande
  create: async (data: CommandeRequest): Promise<ApiResponse<CommandeResponse>> => {
    return apiRequest<CommandeResponse>("/commandes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Mettre à jour le statut (admin)
  updateStatus: async (
    id: string,
    statut: CommandeResponse["statut_commande"],
  ): Promise<ApiResponse<CommandeResponse>> => {
    return apiRequest<CommandeResponse>(`/commandes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ statut_commande: statut }),
    })
  },

  // Annuler une commande
  cancel: async (id: string, raison?: string): Promise<ApiResponse<CommandeResponse>> => {
    return apiRequest<CommandeResponse>(`/commandes/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ raison }),
    })
  },

  // Récupérer les statistiques de commandes (admin)
  getStats: async (
    periode?: "jour" | "semaine" | "mois",
  ): Promise<
    ApiResponse<{
      nouvelles: number
      en_preparation: number
      en_livraison: number
      livrees_jour: number
      revenus_jour: number
      revenus_mois: number
    }>
  > => {
    const query = periode ? `?periode=${periode}` : ""
    return apiRequest(`/commandes/stats${query}`)
  },

  // Suivre une commande en temps réel
  track: async (
    id: string,
  ): Promise<
    ApiResponse<{
      statut: CommandeResponse["statut_commande"]
      position_livreur?: { lat: number; lng: number }
      temps_estime?: number
    }>
  > => {
    return apiRequest(`/commandes/${id}/track`)
  },
}

// ==========================================
// API CLIENTS (Admin)
// ==========================================

export interface ClientResponse {
  id: string
  nom_complet: string
  telephone: string
  email?: string
  date_inscription: string
  nombre_commandes: number
  total_depense: number
  derniere_commande?: string
}

export interface ClientsFilters {
  search?: string
  date_debut?: string
  date_fin?: string
  page?: number
  limit?: number
}

export const clientsApi = {
  // Récupérer tous les clients
  getAll: async (filters?: ClientsFilters): Promise<PaginatedResponse<ClientResponse>> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString() ? `?${params.toString()}` : ""
    return apiRequest<ClientResponse[]>(`/clients${query}`) as Promise<PaginatedResponse<ClientResponse>>
  },

  // Récupérer un client par ID
  getById: async (id: string): Promise<ApiResponse<ClientResponse & { commandes: CommandeResponse[] }>> => {
    return apiRequest(`/clients/${id}`)
  },

  // Récupérer les statistiques clients
  getStats: async (): Promise<
    ApiResponse<{
      total: number
      nouveaux_mois: number
      actifs: number
    }>
  > => {
    return apiRequest("/clients/stats")
  },
}

// ==========================================
// API ADMINS (Super Admin)
// ==========================================

export interface AdminRequest {
  nom: string
  email?: string
  mot_de_passe: string
}

export interface AdminResponse {
  id: string
  nom: string
  email?: string
  date_creation?: string
}

export const adminsApi = {
  // Récupérer tous les administrateurs
  getAll: async (): Promise<ApiResponse<AdminResponse[]>> => {
    return apiRequest<AdminResponse[]>("/admins")
  },

  // Récupérer un administrateur par ID
  getById: async (id: string): Promise<ApiResponse<AdminResponse>> => {
    return apiRequest<AdminResponse>(`/admins/${id}`)
  },

  // Créer un administrateur
  create: async (data: AdminRequest): Promise<ApiResponse<AdminResponse>> => {
    return apiRequest<AdminResponse>("/admins", {
      method: "POST",
      body: JSON.stringify({
        name: data.nom,
        email: data.email,
        password: data.mot_de_passe,
      }),
    })
  },

  // Mettre à jour un administrateur
  update: async (id: string, data: Partial<AdminRequest>): Promise<ApiResponse<AdminResponse>> => {
    return apiRequest<AdminResponse>(`/admins/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.nom ? { name: data.nom } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.mot_de_passe ? { password: data.mot_de_passe } : {}),
      }),
    })
  },

  // Supprimer un administrateur
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>(`/admins/${id}`, {
      method: "DELETE",
    })
  },
}

// ==========================================
// API PANIER
// ==========================================

export interface PanierItem {
  id_plat: string
  id_variation?: string
  quantite: number
  personnalisation?: {
    accompagnements: { id_plat: string; id_variation: string; quantite: number }[]
    supplements: { id_plat: string; id_variation: string; quantite: number }[]
  }
}

export interface PanierResponse {
  id: string
  items: {
    id: string
    plat: PlatResponse
    variation?: { id: string; taille: string; prix: number }
    quantite: number
    prix_unitaire: number
    prix_total: number
    personnalisation?: {
      accompagnements: { plat: PlatResponse; variation: { taille: string; prix: number }; quantite: number }[]
      supplements: { plat: PlatResponse; variation: { taille: string; prix: number }; quantite: number }[]
    }
  }[]
  sous_total: number
  frais_livraison: number
  tva: number
  total: number
}

export const panierApi = {
  // Récupérer le panier actuel
  get: async (): Promise<ApiResponse<PanierResponse>> => {
    return apiRequest<PanierResponse>("/panier")
  },

  // Ajouter un item au panier
  addItem: async (item: PanierItem): Promise<ApiResponse<PanierResponse>> => {
    return apiRequest<PanierResponse>("/panier/items", {
      method: "POST",
      body: JSON.stringify(item),
    })
  },

  // Mettre à jour un item du panier
  updateItem: async (itemId: string, quantite: number): Promise<ApiResponse<PanierResponse>> => {
    return apiRequest<PanierResponse>(`/panier/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantite }),
    })
  },

  // Supprimer un item du panier
  removeItem: async (itemId: string): Promise<ApiResponse<PanierResponse>> => {
    return apiRequest<PanierResponse>(`/panier/items/${itemId}`, {
      method: "DELETE",
    })
  },

  // Vider le panier
  clear: async (): Promise<ApiResponse<null>> => {
    return apiRequest<null>("/panier", {
      method: "DELETE",
    })
  },

  // Appliquer un code promo
  applyPromo: async (code: string): Promise<ApiResponse<PanierResponse & { reduction: number }>> => {
    return apiRequest("/panier/promo", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  },
}

// ==========================================
// API CONTACT
// ==========================================

export interface ContactRequest {
  nom: string
  email: string
  telephone?: string
  sujet: string
  message: string
}

export const contactApi = {
  // Envoyer un message de contact
  send: async (data: ContactRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// ==========================================
// API PAIEMENT
// ==========================================

export interface PaiementRequest {
  id_commande: string
  mode: "airtel_money" | "mobile_cash" | "livraison"
  telephone?: string
}

export interface PaiementResponse {
  id: string
  id_commande: string
  mode: string
  montant: number
  statut: "en_attente" | "reussi" | "echoue"
  reference?: string
  date_paiement?: string
}

export const paiementApi = {
  // Initier un paiement
  initiate: async (data: PaiementRequest): Promise<ApiResponse<PaiementResponse & { redirect_url?: string }>> => {
    return apiRequest("/paiements", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Vérifier le statut d'un paiement
  checkStatus: async (id: string): Promise<ApiResponse<PaiementResponse>> => {
    return apiRequest(`/paiements/${id}/status`)
  },

  // Confirmer un paiement (callback)
  confirm: async (id: string, reference: string): Promise<ApiResponse<PaiementResponse>> => {
    return apiRequest(`/paiements/${id}/confirm`, {
      method: "POST",
      body: JSON.stringify({ reference }),
    })
  },
}

// ==========================================
// API STATISTIQUES (Admin)
// ==========================================

export const statsApi = {
  // Dashboard principal
  getDashboard: async (): Promise<
    ApiResponse<{
      commandes_jour: number
      revenus_jour: number
      plats_menu: number
      inscriptions_mois: number
      tendances: {
        commandes: number
        revenus: number
        plats: number
        inscriptions: number
      }
      revenus_semaine: { jour: string; montant: number }[]
      plats_populaires: { nom: string; commandes: number; pourcentage: number }[]
      commandes_recentes: CommandeResponse[]
    }>
  > => {
    return apiRequest("/stats/dashboard")
  },

  // Revenus par période
  getRevenus: async (
    periode: "jour" | "semaine" | "mois" | "annee",
  ): Promise<
    ApiResponse<{
      labels: string[]
      data: number[]
      total: number
    }>
  > => {
    return apiRequest(`/stats/revenus?periode=${periode}`)
  },

  // Plats les plus vendus
  getTopPlats: async (
    limit = 10,
  ): Promise<
    ApiResponse<{
      plats: { id: string; nom: string; quantite: number; revenus: number }[]
    }>
  > => {
    return apiRequest(`/stats/top-plats?limit=${limit}`)
  },

  // Statistiques clients
  getClientsStats: async (): Promise<
    ApiResponse<{
      total: number
      nouveaux_semaine: number
      nouveaux_mois: number
      panier_moyen: number
    }>
  > => {
    return apiRequest("/stats/clients")
  },
}

// ==========================================
// API PARAMETRES (Admin)
// ==========================================

export interface ParametresRestaurant {
  nom: string
  adresse: string
  telephone: string
  email: string
  horaires: {
    lundi: { ouverture: string; fermeture: string; ferme: boolean }
    mardi: { ouverture: string; fermeture: string; ferme: boolean }
    mercredi: { ouverture: string; fermeture: string; ferme: boolean }
    jeudi: { ouverture: string; fermeture: string; ferme: boolean }
    vendredi: { ouverture: string; fermeture: string; ferme: boolean }
    samedi: { ouverture: string; fermeture: string; ferme: boolean }
    dimanche: { ouverture: string; fermeture: string; ferme: boolean }
  }
  livraison: {
    frais_base: number
    gratuit_a_partir: number
    rayon_km: number
    temps_moyen: number
  }
  paiements: {
    airtel_money: boolean
    mobile_cash: boolean
    livraison: boolean
  }
  notifications: {
    email_nouvelles_commandes: boolean
    sms_statut_commande: boolean
  }
}

export const parametresApi = {
  // Récupérer les paramètres
  get: async (): Promise<ApiResponse<ParametresRestaurant>> => {
    return apiRequest<ParametresRestaurant>("/parametres")
  },

  // Mettre à jour les paramètres
  update: async (data: Partial<ParametresRestaurant>): Promise<ApiResponse<ParametresRestaurant>> => {
    return apiRequest<ParametresRestaurant>("/parametres", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
}

// ==========================================
// API COMMUNES
// ==========================================

export const communesApi = {
  // Récupérer la liste des communes
  getAll: async (): Promise<ApiResponse<{ id: string; nom: string; frais_livraison: number }[]>> => {
    return apiRequest("/communes")
  },
}
