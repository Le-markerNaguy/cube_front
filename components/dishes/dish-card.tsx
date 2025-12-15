"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import Image from "next/image"
import type { Plat } from "@/lib/types"

interface DishCardProps {
  dish: Plat
  onAddToCart?: (dish: Plat) => void
  showDescription?: boolean
  showStockBadge?: boolean
}

export function DishCard({ dish, onAddToCart, showDescription = true, showStockBadge = true }: DishCardProps) {
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart(dish)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden bg-card hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={dish.image || "/placeholder.svg"}
          alt={dish.nom}
          width={350}
          height={250}
          className="w-full h-52 object-cover"
        />
        {showStockBadge && dish.statut_stock === "stock_bas" && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">Stock limité</div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{dish.nom}</h3>
          <span className="text-primary font-bold text-lg">{dish.prix_base.toFixed(2)}f</span>
        </div>
        {showDescription && dish.description && (
          <p className="text-muted-foreground text-sm mb-4">{dish.description}</p>
        )}
        {onAddToCart && (
          <Button
            className={`w-full rounded-full transition-all ${
              added
                ? "bg-green-500 hover:bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            onClick={handleClick}
            disabled={added}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Ajouté au panier
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Commander
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
