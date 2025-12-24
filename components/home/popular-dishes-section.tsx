"use client"

import { DishCard } from "@/components/dishes/dish-card"
import type { Plat } from "@/lib/types"

interface PopularDishesSectionProps {
  title: string
  subtitle: string
  dishes: Plat[]
  onAddToCart: (dish: Plat) => void
}

export function PopularDishesSection({ title, subtitle, dishes, onAddToCart }: PopularDishesSectionProps) {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        <p className="text-muted-foreground text-center mb-12">{subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onAddToCart={onAddToCart}
              showDescription={false}
              showStockBadge={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
