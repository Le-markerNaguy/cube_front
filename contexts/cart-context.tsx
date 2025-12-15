"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { panierApi } from "@/lib/api"

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

  // Charger le panier au montage
  useEffect(() => {
    const loadCart = async () => {
      // En production, cela appellera l'API si l'utilisateur est connecté
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
    loadCart()
  }, [])

  // Sauvegarder le panier
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cube_cart", JSON.stringify({ items }))
    } else {
      localStorage.removeItem("cube_cart")
    }
  }, [items])

  // Calculs
  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0)
  const sousTotal = items.reduce((sum, item) => sum + item.prixTotal, 0) - reduction
  const fraisLivraison = items.length > 0 ? FRAIS_LIVRAISON : 0
  const tva = sousTotal * TVA_RATE
  const total = sousTotal + fraisLivraison + tva

  const addSimpleItem = useCallback(async (plat: Plat, variation?: Variation, quantite = 1) => {
    setIsLoading(true)

    const prix = variation ? variation.prix : plat.prix_base

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

    setIsCartOpen(true)
    setIsLoading(false)
  }, [])

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

    const newItem: CartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "personnalise",
      personnalisation,
      quantite,
      prixUnitaire,
      prixTotal: prixUnitaire * quantite,
    }

    setItems((prev) => [...prev, newItem])
    setIsCartOpen(true)
    setIsLoading(false)
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback(
    async (itemId: string, quantite: number) => {
      if (quantite < 1) {
        await removeItem(itemId)
        return
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
    [removeItem],
  )

  const clearCart = useCallback(async () => {
    setItems([])
    setReduction(0)
    localStorage.removeItem("cube_cart")
  }, [])

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
