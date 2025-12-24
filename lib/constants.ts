// ==========================================
// CONSTANTES DE L'APPLICATION
// ==========================================

// Communes de Kinshasa avec frais de livraison
export const COMMUNES_KINSHASA = [
  { id: "bandalungwa", nom: "Bandalungwa", frais_livraison: 3 },
  { id: "barumbu", nom: "Barumbu", frais_livraison: 3 },
  { id: "gombe", nom: "Gombe", frais_livraison: 2.5 },
  { id: "kalamu", nom: "Kalamu", frais_livraison: 3 },
  { id: "kasa-vubu", nom: "Kasa-Vubu", frais_livraison: 3 },
  { id: "kimbanseke", nom: "Kimbanseke", frais_livraison: 5 },
  { id: "kinshasa", nom: "Kinshasa", frais_livraison: 2.5 },
  { id: "kintambo", nom: "Kintambo", frais_livraison: 3 },
  { id: "kisenso", nom: "Kisenso", frais_livraison: 4 },
  { id: "lemba", nom: "Lemba", frais_livraison: 3.5 },
  { id: "limete", nom: "Limete", frais_livraison: 3 },
  { id: "lingwala", nom: "Lingwala", frais_livraison: 2.5 },
  { id: "makala", nom: "Makala", frais_livraison: 3.5 },
  { id: "maluku", nom: "Maluku", frais_livraison: 7 },
  { id: "masina", nom: "Masina", frais_livraison: 4 },
  { id: "matete", nom: "Matete", frais_livraison: 3.5 },
  { id: "mont-ngafula", nom: "Mont-Ngafula", frais_livraison: 5 },
  { id: "ndjili", nom: "Ndjili", frais_livraison: 4.5 },
  { id: "ngaba", nom: "Ngaba", frais_livraison: 3.5 },
  { id: "ngaliema", nom: "Ngaliema", frais_livraison: 4 },
  { id: "ngiri-ngiri", nom: "Ngiri-Ngiri", frais_livraison: 3 },
  { id: "nsele", nom: "Nsele", frais_livraison: 6 },
  { id: "selembao", nom: "Selembao", frais_livraison: 4.5 },
]

// Catégories de plats
export const CATEGORIES = [
  "Tous",
  "Plat-menus",
  "Bases",
  "Accompagnements",
  "Suppléments",
  "Boissons",
  "Desserts",
]

// Modes de paiement
export const MODES_PAIEMENT = [
  {
    id: "airtel_money",
    nom: "Airtel Money",
    description: "Paiement sécurisé via Airtel Money",
    icon: "phone",
  },
  {
    id: "mobile_cash",
    nom: "Mobile Cash",
    description: "Confirmation et paiement via mobile",
    icon: "smartphone",
  },
  {
    id: "livraison",
    nom: "Paiement à la livraison",
    description: "Payez en espèces à la réception",
    icon: "banknote",
  },
]

// Statuts de commande
export const STATUTS_COMMANDE = {
  en_attente: { label: "Nouvelle", color: "bg-blue-100 text-blue-800" },
  confirmee: { label: "Confirmée", color: "bg-green-100 text-green-800" },
  en_preparation: { label: "En préparation", color: "bg-yellow-100 text-yellow-800" },
  en_livraison: { label: "En livraison", color: "bg-orange-100 text-orange-800" },
  livree: { label: "Livrée", color: "bg-green-100 text-green-800" },
  annulee: { label: "Annulée", color: "bg-red-100 text-red-800" },
}



// Tailles disponibles
export const TAILLES = [
  { id: "petit", label: "Petit", short: "P" },
  { id: "moyen", label: "Moyen", short: "M" },
  { id: "grand", label: "Grand", short: "G" },
]

// Configuration TVA et frais
export const CONFIG = {
  TVA_RATE: 0.16, // 16%
  FRAIS_LIVRAISON_BASE: 3,
  LIVRAISON_GRATUITE_A_PARTIR: 50,
  DEVISE: "f",
  DEVISE_SYMBOL: "FC",
}

// Sujets de contact
export const SUJETS_CONTACT = [
  "Question générale",
  "Problème de commande",
  "Réclamation",
  "Partenariat",
  "Suggestion",
  "Autre",
]

// Informations restaurant
export const INFO_RESTAURANT = {
  nom: "CUBE Restaurant",
  adresse: "123 Rue de la Gastronomie, 75001 Paris",
  telephone: "+243 812 345 678",
  email: "contact@cube-restaurant.com",
  horaires: {
    semaine: "11h-20h",
    weekend: "12h-18h",
  },
}
