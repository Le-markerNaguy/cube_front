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
    <Card className="group overflow-hidden bg-neutral-50 border border-gray-200 rounded-full aspect-square transition-shadow hover:shadow-lg">
      {/* Image area: centered circular image with gentle zoom on hover */}
      <div className="w-full flex items-center justify-center p-6">
        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden relative transform transition-transform duration-300 group-hover:scale-105">
          <Image
            src={dish.image || "/placeholder.svg"}
            alt={dish.nom}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 128px"
          />
        </div>
      </div>

      <CardContent className="p-4 text-center flex flex-col items-center gap-2">
        <h3 className="font-semibold text-lg">{dish.nom}</h3>
        <span className="text-primary font-bold text-lg">{dish.prix_base.toFixed(2)}f</span>

        {showDescription && dish.description && (
          <p className="text-muted-foreground text-sm max-w-48">{dish.description}</p>
        )}

        {onAddToCart && (
          <Button
            className={`mt-3 rounded-full px-5 py-2 transform transition duration-150 ${
              added
                ? "bg-green-500 hover:bg-green-500 text-white shadow-sm"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-sm hover:shadow-md"
            }`}
            onClick={handleClick}
            disabled={added}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Ajouté
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
