"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { platsApi, commandesApi, type PlatResponse, type CommandeResponse } from "@/lib/api"

interface Plat {
  id: string
  nom: string
  description: string
  type: "menu" | "base" | "accompagnement" | "supplement"
  prix_base: number
  categorie: string
  image?: string
  statut: "actif" | "inactif"
  variations?: {
    id: string
    id_plat: string
    taille: "petit" | "moyen" | "grand"
    prix: number
  }[]
}

interface Commande {
  id: string
  statut_commande: string
  date_commande: Date
  total: number
  client: {
    id: string
    nom_complet: string
    telephone: string
  }
  lignes: Array<{
    id: string
    id_plat: string
    nom_plat: string
    quantite: number
    prix_unitaire: number
    prix_total: number
  }>
}

interface DishesContextType {
  // Données
  platsMenu: Plat[]
  platsBase: Plat[]
  platsAccompagnement: Plat[]
  platsSupplement: Plat[]
  commandes: Commande[]
  popularDishes: Plat[]
  categories: string[]
  isLoading: boolean

  // Actions plats
  addPlat: (plat: Omit<Plat, "id">) => Promise<{ success: boolean; error?: string }>
  updatePlat: (id: string, updates: Partial<Plat>) => Promise<{ success: boolean; error?: string }>
  deletePlat: (id: string) => Promise<{ success: boolean; error?: string }>
  uploadImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>

  // Actions commandes
  addCommande: (commande: any) => Promise<{ success: boolean; data?: Commande; error?: string }>
  updateCommandeStatus: (id: string, statut: string) => Promise<{ success: boolean; error?: string }>

  // Rafraîchissement
  refreshPlats: () => Promise<void>
  refreshCommandes: () => Promise<void>
}

const DishesContext = createContext<DishesContextType | undefined>(undefined)

export function DishesProvider({ children }: { children: ReactNode }) {
  const [platsMenu, setPlatsMenu] = useState<Plat[]>([])
  const [platsBase, setPlatsBase] = useState<Plat[]>([])
  const [platsAccompagnement, setPlatsAccompagnement] = useState<Plat[]>([])
  const [platsSupplement, setPlatsSupplement] = useState<Plat[]>([])
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [popularDishes, setPopularDishes] = useState<Plat[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const transformPlat = (apiPlat: PlatResponse): Plat => ({
    id: apiPlat.id,
    nom: apiPlat.nom,
    description: apiPlat.description,
    type: apiPlat.type,
    prix_base: apiPlat.prix_base,
    categorie: apiPlat.categorie,
    image: apiPlat.image,
    statut: apiPlat.statut,
    variations: apiPlat.variations,
  })

  const transformCommande = (apiCommande: CommandeResponse): Commande => ({
    id: apiCommande.id,
    statut_commande: apiCommande.statut_commande,
    date_commande: new Date(apiCommande.date_commande),
    total: apiCommande.total,
    client: apiCommande.client,
    lignes: apiCommande.lignes.map((l) => ({
      id: l.id,
      id_plat: l.id_plat,
      nom_plat: l.nom_plat,
      quantite: l.quantite,
      prix_unitaire: l.prix_unitaire,
      prix_total: l.prix_total,
    })),
  })

  const refreshPlats = useCallback(async () => {
    setIsLoading(true)

    const [menuRes, baseRes, accRes, supRes, catRes, popRes] = await Promise.all([
      platsApi.getMenu(),
      platsApi.getBases(),
      platsApi.getAccompagnements(),
      platsApi.getSupplements(),
      platsApi.getCategories(),
      platsApi.getPopular(6),
    ])

    if (menuRes.success && menuRes.data) {
      setPlatsMenu(menuRes.data.map(transformPlat))
    }
    if (baseRes.success && baseRes.data) {
      setPlatsBase(baseRes.data.map(transformPlat))
    }
    if (accRes.success && accRes.data) {
      setPlatsAccompagnement(accRes.data.map(transformPlat))
    }
    if (supRes.success && supRes.data) {
      setPlatsSupplement(supRes.data.map(transformPlat))
    }
    if (catRes.success && catRes.data) {
      setCategories(["Tous", ...catRes.data])
    }
    if (popRes.success && popRes.data) {
      setPopularDishes(popRes.data.map(transformPlat))
    }

    setIsLoading(false)
  }, [])

  const refreshCommandes = useCallback(async () => {
    const response = await commandesApi.getAll()
    if (response.success && response.data) {
      setCommandes(response.data.map(transformCommande))
    }
  }, [])

  // Charger les données au montage
  useEffect(() => {
    refreshPlats()
    refreshCommandes()
  }, [refreshPlats, refreshCommandes])

  const addPlat = useCallback(
    async (plat: Omit<Plat, "id">) => {
      const response = await platsApi.create({
        nom: plat.nom,
        description: plat.description,
        type: plat.type,
        prix_base: plat.prix_base,
        categorie: plat.categorie,
        image: plat.image,
        statut: plat.statut,
        variations: plat.variations?.map((v) => ({
          taille: v.taille,
          prix: v.prix,
        })),
      })

      if (!response.success) {
        return { success: false, error: response.error }
      }

      // Rafraîchir la liste
      await refreshPlats()
      return { success: true }
    },
    [refreshPlats],
  )

  const updatePlat = useCallback(
    async (id: string, updates: Partial<Plat>) => {
      const response = await platsApi.update(id, {
        nom: updates.nom,
        description: updates.description,
        type: updates.type,
        prix_base: updates.prix_base,
        categorie: updates.categorie,
        image: updates.image,
        statut: updates.statut,
      })

      if (!response.success) {
        return { success: false, error: response.error }
      }

      await refreshPlats()
      return { success: true }
    },
    [refreshPlats],
  )

  const deletePlat = useCallback(
    async (id: string) => {
      const response = await platsApi.delete(id)

      if (!response.success) {
        return { success: false, error: response.error }
      }

      await refreshPlats()
      return { success: true }
    },
    [refreshPlats],
  )

  const uploadImage = useCallback(async (file: File) => {
    const response = await platsApi.uploadImage(file)

    if (!response.success) {
      return { success: false, error: response.error }
    }

    return { success: true, url: response.data?.url }
  }, [])

  const addCommande = useCallback(
    async (commandeData: any) => {
      const response = await commandesApi.create(commandeData)

      if (!response.success) {
        return { success: false, error: response.error }
      }

      await refreshCommandes()
      return { success: true, data: transformCommande(response.data!) }
    },
    [refreshCommandes],
  )

  const updateCommandeStatus = useCallback(
    async (id: string, statut: string) => {
      const response = await commandesApi.updateStatus(id, statut as any)

      if (!response.success) {
        return { success: false, error: response.error }
      }

      await refreshCommandes()
      return { success: true }
    },
    [refreshCommandes],
  )

  return (
    <DishesContext.Provider
      value={{
        platsMenu,
        platsBase,
        platsAccompagnement,
        platsSupplement,
        commandes,
        popularDishes,
        categories,
        isLoading,
        addPlat,
        updatePlat,
        deletePlat,
        uploadImage,
        addCommande,
        updateCommandeStatus,
        refreshPlats,
        refreshCommandes,
      }}
    >
      {children}
    </DishesContext.Provider>
  )
}

export function useDishes() {
  const context = useContext(DishesContext)
  if (context === undefined) {
    throw new Error("useDishes must be used within a DishesProvider")
  }
  return context
}
