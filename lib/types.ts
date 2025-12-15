// ==========================================
// ENTITÉS PRINCIPALES - MCD CUBE RESTAURANT
// ==========================================

// CLIENT
export interface Client {
  id: string
  nom_complet: string
  telephone: string
  email?: string
  mot_de_passe: string
  date_inscription: Date
}

// PLAT
export type TypePlat = "menu" | "base" | "accompagnement" | "supplement"
export type StatutPlat = "actif" | "inactif"
export type StatutStock = "en_stock" | "stock_bas" | "rupture"

export interface Plat {
  id: string
  nom: string
  description: string
  type: TypePlat
  prix_base: number // Pour les plats de type "menu"
  categorie: string
  image?: string
  statut: StatutPlat
  statut_stock: StatutStock
  variations?: VariationPlat[]
}

// VARIATION PLAT (pour base, accompagnement, supplément)
export type TailleVariation = "petit" | "moyen" | "grand"

export interface VariationPlat {
  id: string
  id_plat: string
  taille: TailleVariation
  prix: number
}

// PLAT PERSONNALISÉ
export interface PlatPersonnalise {
  id: string
  id_client: string
  id_plat_base: string // Plat de type "base"
  id_variation_base: string
  quantite: number
  prix_base_calcule: number
  accompagnements: PersoAccompagnement[]
  supplements: PersoSupplement[]
  prix_total: number
  date_creation: Date
}

export interface PersoAccompagnement {
  id: string
  id_plat_personnalise: string
  id_plat: string // Plat de type "accompagnement"
  id_variation: string
  quantite: number
  prix_calcule: number
}

export interface PersoSupplement {
  id: string
  id_plat_personnalise: string
  id_plat: string // Plat de type "supplement"
  id_variation: string
  quantite: number
  prix_calcule: number
}

// PANIER
export interface Panier {
  id: string
  id_client: string
  lignes: LignePanier[]
  date_creation: Date
  date_modification: Date
}

export interface LignePanier {
  id: string
  id_panier: string
  id_plat?: string // Pour commande simple (plat menu)
  id_plat_personnalise?: string // Pour plat personnalisé
  id_variation?: string // Variation si plat simple avec variation
  quantite: number
  prix_unitaire: number
  prix_total: number
  // Données dénormalisées pour l'affichage
  plat?: Plat
  platPersonnalise?: PlatPersonnalise
}

// COMMANDE
export type StatutCommande = "en_attente" | "en_preparation" | "en_livraison" | "livree" | "annulee"

export interface Commande {
  id: string
  id_client: string
  id_panier: string
  adresse_livraison: string
  ville: string
  commune: string
  instructions?: string
  statut_commande: StatutCommande
  date_commande: Date
  date_confirmation?: Date
  date_depart_livraison?: Date
  date_livree?: Date
  lignes: LigneCommande[]
  paiement: Paiement
  sous_total: number
  frais_livraison: number
  tva: number
  total: number
  // Données client dénormalisées
  client?: Client
}

export interface LigneCommande {
  id: string
  id_commande: string
  id_plat?: string
  id_plat_personnalise?: string
  id_variation?: string
  quantite: number
  prix_unitaire: number
  prix_total: number
  nom_plat: string
  details?: string // Détails pour plat personnalisé
}

// PAIEMENT
export type ModePaiement = "airtel_money" | "mobile_cash" | "livraison"
export type StatutPaiement = "en_attente" | "reussi" | "echoue"

export interface Paiement {
  id: string
  id_commande: string
  mode: ModePaiement
  montant: number
  statut: StatutPaiement
  date_paiement?: Date
  reference?: string
}

// ==========================================
// ALIAS EXPORTS FOR ADMIN PAGES
// ==========================================

export enum OrderStatus {
  PENDING = "en_attente",
  CONFIRMED = "confirmee",
  PREPARING = "en_preparation",
  READY = "pret",
  DELIVERING = "en_livraison",
  DELIVERED = "livree",
  CANCELLED = "annulee",
}

export type StockStatus = "available" | "low" | "out"

export interface User {
  id: string
  phone: string
  fullName: string
  email?: string
  addresses: UserAddress[]
  createdAt: Date
  updatedAt: Date
}

export interface UserAddress {
  id: string
  label: string
  address: string
  commune: string
  city: string
  isDefault: boolean
}

export interface DishVariation {
  name: string
  priceModifier: number
}

export interface Dish {
  id: string
  name: string
  description: string
  category: string
  basePrice: number
  image: string
  stockStatus: StockStatus
  isActive: boolean
  preparationTime: number
  variations?: DishVariation[]
  createdAt?: Date
  updatedAt?: Date
}

export interface OrderItem {
  dishId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variation?: string
  customizations?: string[]
}

export interface DeliveryInfo {
  fullName: string
  phone: string
  address: string
  commune: string
  city: string
  instructions?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  deliveryInfo: DeliveryInfo
  paymentMethod: "airtel_money" | "moov_money" | "cash_on_delivery"
  status: OrderStatus
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// TYPES UTILITAIRES
// ==========================================

export interface CartItem {
  id: string
  type: "simple" | "personnalise"
  plat?: Plat
  variation?: VariationPlat
  platPersonnalise?: PlatPersonnalise
  quantite: number
  prixUnitaire: number
  prixTotal: number
}

export interface AuthState {
  isAuthenticated: boolean
  client: Client | null
  isLoading: boolean
}

// Stats Admin
export interface DashboardStats {
  commandesAujourdhui: number
  revenusJour: number
  platsAuMenu: number
  inscriptionsMois: number
  tendanceCommandes: number
  tendanceRevenus: number
  tendancePlats: number
  tendanceInscriptions: number
}

export interface CommandeRecente {
  id: string
  client: string
  articles: string
  total: number
  statut: StatutCommande
  heure: string
}
