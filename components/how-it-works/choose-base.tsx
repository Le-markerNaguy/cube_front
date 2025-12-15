"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

const bases = [
  {
    id: 1,
    name: "Poulet braisé",
    description: "Poulet tendre parfaitement assaisonné",
    price: 12.0,
    image: "/grilled-chicken-braise-african-style.jpg",
  },
  {
    id: 2,
    name: "Poisson grillé",
    description: "Filet de poisson frais grillé",
    price: 14.0,
    image: "/grilled-fish-with-vegetables.jpg",
  },
  {
    id: 3,
    name: "Boulettes de viande",
    description: "Boulettes maison savoureuses",
    price: 11.0,
    image: "/meatballs-in-sauce.jpg",
  },
  {
    id: 4,
    name: "Sandwich maison",
    description: "Pain frais garni généreusement",
    price: 9.5,
    image: "/homemade-sandwich-fresh-bread.jpg",
  },
  {
    id: 5,
    name: "Riz cantonnais",
    description: "Riz sauté aux légumes",
    price: 10.0,
    image: "/cantonese-fried-rice-vegetables.jpg",
  },
]

export function ChooseBase() {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choisir votre base</h2>
            <p className="text-gray-600 text-sm">La base constitue l'élément principal du plat.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bases.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-28">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-1">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold text-sm">{item.price.toFixed(2)} f</span>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7 rounded-full"
                  >
                    Sélectionner
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
