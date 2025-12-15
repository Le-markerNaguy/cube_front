"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { EmptyState } from "@/components/ui/empty-state"
import { CartItem } from "@/components/cart/cart-item"
import { OrderSummary } from "@/components/cart/order-summary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Trash2, ShoppingBag } from "lucide-react"
import { platsBase, platsAccompagnement, platsSupplément } from "@/lib/data"

export default function PanierPage() {
  const { items, itemCount, sousTotal, fraisLivraison, tva, total, removeItem, updateQuantity, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  // Helper pour obtenir les détails d'un item
  const getItemDetails = (item: (typeof items)[0]) => {
    if (item.type === "simple") {
      return {
        name: item.plat?.nom || "",
        description: item.variation ? `Taille: ${item.variation.taille}` : undefined,
        image: item.plat?.image || "/placeholder.svg",
      }
    }

    const base = platsBase.find((p) => p.id === item.platPersonnalise?.id_plat_base)
    const accompagnements = item.platPersonnalise?.accompagnements
      .map((a) => platsAccompagnement.find((p) => p.id === a.id_plat)?.nom)
      .filter(Boolean)
    const supplements = item.platPersonnalise?.supplements
      .map((s) => platsSupplément.find((p) => p.id === s.id_plat)?.nom)
      .filter(Boolean)

    return {
      name: `${base?.nom} (Personnalisé)`,
      description: [...(accompagnements || []), ...(supplements || [])].join(", ") || undefined,
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
