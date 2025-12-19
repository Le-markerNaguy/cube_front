"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { EmptyState } from "@/components/ui/empty-state"
import { CartItem } from "@/components/cart/cart-item"
import { OrderSummary } from "@/components/cart/order-summary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Trash2, ShoppingBag } from "lucide-react"
import { platsApi, type PlatResponse } from "@/lib/api"
import { useEffect, useState } from "react"

export default function PanierPage() {
  const { items, itemCount, sousTotal, fraisLivraison, tva, total, removeItem, updateQuantity, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [bases, setBases] = useState<PlatResponse[]>([])
  const [accompagnements, setAccompagnements] = useState<PlatResponse[]>([])
  const [supplements, setSupplements] = useState<PlatResponse[]>([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const [bRes, aRes, sRes] = await Promise.all([
        platsApi.getBases(),
        platsApi.getAccompagnements(),
        platsApi.getSupplements(),
      ])

      if (!mounted) return

      if (bRes.success) setBases(bRes.data || [])
      if (aRes.success) setAccompagnements(aRes.data || [])
      if (sRes.success) setSupplements(sRes.data || [])
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  // Helper pour obtenir les détails d'un item
  const getItemDetails = (item: (typeof items)[0]) => {
    if (item.type === "simple") {
      return {
        name: item.plat?.nom || "",
        description: item.variation ? `Taille: ${item.variation.taille}` : undefined,
        image: item.plat?.image || "/placeholder.svg",
      }
    }

    // Supporter différentes formes de personnalisation (nouvelle forme avec `personnalisation` ou ancienne forme avec `platPersonnalise`)
    const baseFromCart = (item as any).personnalisation?.base?.plat
    const baseFromPersonnalisationId = (item as any).personnalisation?.base?.id_plat
      ? bases.find((p) => p.id === (item as any).personnalisation.base.id_plat)
      : null
    const baseFromOldIds = (item as any).platPersonnalise?.id_plat_base
      ? bases.find((p) => p.id === (item as any).platPersonnalise.id_plat_base)
      : null

    const base = baseFromCart || baseFromPersonnalisationId || baseFromOldIds

    const getNameFromPossibilities = (entry: any, list: PlatResponse[], idKey = "id_plat") => {
      if (!entry) return undefined
      if (entry.plat?.nom) return entry.plat.nom
      if (entry[idKey]) return list.find((p) => p.id === entry[idKey])?.nom
      return undefined
    }

    const accompNames = ((item as any).personnalisation?.accompagnements || (item as any).platPersonnalise?.accompagnements || [])
      .map((a: any) => getNameFromPossibilities(a, accompagnements))
      .filter(Boolean)

    const suppNames = ((item as any).personnalisation?.supplements || (item as any).platPersonnalise?.supplements || [])
      .map((s: any) => getNameFromPossibilities(s, supplements))
      .filter(Boolean)

    return {
      name: base?.nom ? `${base.nom} (Personnalisé)` : "Personnalisé",
      description: [...accompNames, ...suppNames].join(", ") || undefined,
      image: base?.image || "/placeholder.svg",
    }
  }

  if (items.length === 0) {
    return (
      <PageLayout className="flex items-center justify-center bg-muted/30">
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          description="Découvrez notre menu et ajoutez des plats délicieux à votre panier"
          actions={[
            { label: "Voir le menu", href: "/menu" },
            { label: "Personnaliser un plat", href: "/personnaliser", variant: "outline" },
          ]}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout className="bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon panier</h1>
            <p className="text-muted-foreground">
              {itemCount} article{itemCount > 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                itemDetails={getItemDetails(item)}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Récapitulatif */}
          <div>
            <OrderSummary
              sousTotal={sousTotal}
              fraisLivraison={fraisLivraison}
              tva={tva}
              total={total}
              isAuthenticated={isAuthenticated}
              submitLabel="Passer la commande"
              submitHref="/commande"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
