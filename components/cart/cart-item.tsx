"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { ItemPanier } from "@/lib/types"

interface CartItemProps {
  item: ItemPanier
  itemDetails: {
    name: string
    description?: string
    image: string
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, itemDetails, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image src={itemDetails.image || "/placeholder.svg"} alt={itemDetails.name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{itemDetails.name}</h3>
                {itemDetails.description && <p className="text-sm text-muted-foreground">{itemDetails.description}</p>}
              </div>
              <p className="text-primary font-bold text-lg">{item.prixTotal.toFixed(2)}f</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantite - 1)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-6 text-center">{item.quantite}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantite + 1)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
