"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { panierApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface Plat {
  id: string
  nom: string
  description: string
  prix_base: number
  image?: string
}

interface Variation {
  id: string
  taille: string
  prix: number
}

interface CartItem {
  id: string
  type: "simple" | "personnalise"
  plat?: Plat
  variation?: Variation
  quantite: number
  prixUnitaire: number
  prixTotal: number
  personnalisation?: {
    base: { plat: Plat; variation: Variation }
    accompagnements: { plat: Plat; variation: Variation; quantite: number }[]
    supplements: { plat: Plat; variation: Variation; quantite: number }[]
  }
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  sousTotal: number
  fraisLivraison: number
  tva: number
  total: number
  isLoading: boolean

  addSimpleItem: (plat: Plat, variation?: Variation, quantite?: number) => Promise<void>
  addCustomItem: (personnalisation: CartItem["personnalisation"], quantite: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantite: number) => Promise<void>
  clearCart: () => Promise<void>
  applyPromoCode: (code: string) => Promise<{ success: boolean; reduction?: number; error?: string }>

  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const FRAIS_LIVRAISON = 3.0
const TVA_RATE = 0.16

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reduction, setReduction] = useState(0)

  const { isAuthenticated } = useAuth()

  // Helper: map server panier item -> CartItem
  const mapServerItem = (it: any): CartItem => {
    if (it.plat) {
      return {
        id: it.id,
        type: "simple",
        plat: {
          id: it.plat.id,
          nom: it.plat.nom,
          description: it.plat.description,
          prix_base: it.plat.prix_base,
          image: it.plat.image,
        },
        variation: it.variation ? { id: it.variation.id, taille: it.variation.taille, prix: it.variation.prix } : undefined,
        quantite: it.quantite,
        prixUnitaire: it.prix_unitaire ?? (it.variation ? it.variation.prix : it.plat.prix_base),
        prixTotal: it.prix_total ?? (it.quantite * (it.prix_unitaire ?? (it.variation ? it.variation.prix : it.plat.prix_base))),
      }
    }

    // personnalisation
    if (it.personnalisation) {
      const basePlat = it.personnalisation.base?.plat
      const baseVariation = it.personnalisation.base?.variation

      let baseValue: any = undefined
      if (basePlat && baseVariation) {
        baseValue = {
          plat: { id: basePlat.id, nom: basePlat.nom, description: basePlat.description, prix_base: basePlat.prix_base, image: basePlat.image },
          variation: { id: baseVariation.id, taille: baseVariation.taille, prix: baseVariation.prix },
        }
      } else if (it.personnalisation.base) {
        baseValue = {
          plat: { id: it.personnalisation.base.id_plat, nom: "", description: "", prix_base: 0 },
          variation: { id: it.personnalisation.base.id_variation, taille: "", prix: 0 },
        } as any
      }

      return {
        id: it.id,
        type: "personnalise",
        personnalisation: {
          base: baseValue,
          accompagnements: (it.personnalisation.accompagnements || []).map((a: any) => ({ plat: { id: a.plat?.id ?? a.id_plat, nom: a.plat?.nom ?? "", description: a.plat?.description ?? "", prix_base: a.plat?.prix_base ?? 0, image: a.plat?.image }, variation: { id: a.variation?.id ?? a.id_variation, taille: a.variation?.taille ?? "", prix: a.variation?.prix ?? 0 }, quantite: a.quantite })),
          supplements: (it.personnalisation.supplements || []).map((s: any) => ({ plat: { id: s.plat?.id ?? s.id_plat, nom: s.plat?.nom ?? "", description: s.plat?.description ?? "", prix_base: s.plat?.prix_base ?? 0, image: s.plat?.image }, variation: { id: s.variation?.id ?? s.id_variation, taille: s.variation?.taille ?? "", prix: s.variation?.prix ?? 0 }, quantite: s.quantite })),
        },
        quantite: it.quantite,
        prixUnitaire: it.prix_unitaire ?? 0,
        prixTotal: it.prix_total ?? (it.quantite * (it.prix_unitaire ?? 0)),
      }
    }

    // fallback
    return {
      id: it.id,
      type: "simple",
      quantite: it.quantite || 1,
      prixUnitaire: it.prix_unitaire || 0,
      prixTotal: it.prix_total || 0,
    } as CartItem
  }

  // Charger le panier (local ou serveur selon auth)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)

      if (isAuthenticated) {
        try {
          const res = await panierApi.get()
          if (!mounted) return
          if (res.success && res.data) {
            setItems((res.data.items || []).map(mapServerItem))
          } else {
            setItems([])
          }
        } catch (e) {
          console.error("Erreur chargement panier serveur", e)
          setItems([])
        }
      } else {
        // local storage
        const stored = localStorage.getItem("cube_cart")
        if (stored) {
          try {
            const data = JSON.parse(stored)
            setItems(data.items || [])
          } catch {
            localStorage.removeItem("cube_cart")
          }
        }
      }

      setIsLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  // Sauvegarder le panier local uniquement si non connecté
  useEffect(() => {
    if (isAuthenticated) return

    if (items.length > 0) {
      localStorage.setItem("cube_cart", JSON.stringify({ items }))
    } else {
      localStorage.removeItem("cube_cart")
    }
  }, [items, isAuthenticated])

  // Calculs
  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0)
  const sousTotal = items.reduce((sum, item) => sum + item.prixTotal, 0) - reduction
  const fraisLivraison = items.length > 0 ? FRAIS_LIVRAISON : 0
  const tva = sousTotal * TVA_RATE
  const total = sousTotal + fraisLivraison + tva

  const addSimpleItem = useCallback(async (plat: Plat, variation?: Variation, quantite = 1) => {
    setIsLoading(true)

    const prix = variation ? variation.prix : plat.prix_base

    if (isAuthenticated) {
      // Envoyer sur le serveur
      try {
        const payload: any = { id_plat: plat.id, quantite, prix_unitaire: prix }
        if (variation) payload.id_variation = variation.id
        const res = await panierApi.addItem(payload)
        if (res.success && res.data) {
          setItems((res.data as any).items.map(mapServerItem))
        }
      } catch (e) {
        console.error("Erreur addSimpleItem API", e)
      }
    } else {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.type === "simple" && item.plat?.id === plat.id && item.variation?.id === variation?.id,
        )

        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantite: updated[existingIndex].quantite + quantite,
            prixTotal: (updated[existingIndex].quantite + quantite) * prix,
          }
          return updated
        }

        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "simple",
          plat,
          variation,
          quantite,
          prixUnitaire: prix,
          prixTotal: prix * quantite,
        }

        return [...prev, newItem]
      })
    }

    setIsCartOpen(true)
    setIsLoading(false)
  }, [isAuthenticated])

  const addCustomItem = useCallback(async (personnalisation: CartItem["personnalisation"], quantite: number) => {
    if (!personnalisation) return

    setIsLoading(true)

    const prixBase = personnalisation.base.variation.prix
    const prixAccompagnements = personnalisation.accompagnements.reduce(
      (sum, a) => sum + a.variation.prix * a.quantite,
      0,
    )
    const prixSupplements = personnalisation.supplements.reduce((sum, s) => sum + s.variation.prix * s.quantite, 0)
    const prixUnitaire = prixBase + prixAccompagnements + prixSupplements

    if (isAuthenticated) {
      try {
        const payload: any = {
          id_plat: personnalisation.base.plat.id,
          quantite,
          personnalisation: {
            base: { id_plat: personnalisation.base.plat.id, id_variation: personnalisation.base.variation.id },
            accompagnements: personnalisation.accompagnements.map((a) => ({ id_plat: a.plat.id, id_variation: a.variation.id, quantite: a.quantite })),
            supplements: personnalisation.supplements.map((s) => ({ id_plat: s.plat.id, id_variation: s.variation.id, quantite: s.quantite })),
          },
          prix_unitaire: prixUnitaire,
        }

        const res = await panierApi.addItem(payload)
        if (res.success && res.data) {
          setItems((res.data as any).items.map(mapServerItem))
        }
      } catch (e) {
        console.error("Erreur addCustomItem API", e)
      }
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "personnalise",
        personnalisation,
        quantite,
        prixUnitaire,
        prixTotal: prixUnitaire * quantite,
      }

      setItems((prev) => [...prev, newItem])
    }

    setIsCartOpen(true)
    setIsLoading(false)
  }, [isAuthenticated])

  const removeItem = useCallback(async (itemId: string) => {
    if (isAuthenticated) {
      try {
        const res = await panierApi.removeItem(itemId)
        if (res.success && res.data) {
          setItems((res.data as any).items.map(mapServerItem))
          return
        }
      } catch (e) {
        console.error("Erreur removeItem API", e)
      }
    }

    // fallback local
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [isAuthenticated])

  const updateQuantity = useCallback(
    async (itemId: string, quantite: number) => {
      if (quantite < 1) {
        await removeItem(itemId)
        return
      }

      if (isAuthenticated) {
        try {
          const res = await panierApi.updateItem(itemId, quantite)
          if (res.success && res.data) {
            setItems((res.data as any).items.map(mapServerItem))
            return
          }
        } catch (e) {
          console.error("Erreur updateQuantity API", e)
        }
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item
          return {
            ...item,
            quantite,
            prixTotal: item.prixUnitaire * quantite,
          }
        }),
      )
    },
    [removeItem, isAuthenticated],
  )

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await panierApi.clear()
        if (res.success) {
          setItems([])
        }
      } catch (e) {
        console.error("Erreur clearCart API", e)
      }
    } else {
      setItems([])
      localStorage.removeItem("cube_cart")
    }
    setReduction(0)
  }, [isAuthenticated])

  const applyPromoCode = useCallback(async (code: string) => {
    const response = await panierApi.applyPromo(code)

    if (!response.success) {
      return { success: false, error: response.error || "Code promo invalide" }
    }

    setReduction(response.data?.reduction || 0)
    return { success: true, reduction: response.data?.reduction }
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        sousTotal,
        fraisLivraison,
        tva,
        total,
        isLoading,
        addSimpleItem,
        addCustomItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
