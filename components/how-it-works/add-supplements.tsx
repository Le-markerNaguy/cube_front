"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

const supplements = [
  {
    id: 1,
    name: "Fromage fondu",
    description: "Fromage crémeux fondu",
    price: 2000.0,
    image: "/melted-cheese-topping.jpg",
  },
  {
    id: 2,
    name: "Double viande",
    description: "Double portion de viande",
    price: 1500.0,
    image: "/extra-meat-portion-grilled.jpg",
  },
  {
    id: 3,
    name: "Extra sauce",
    description: "Sauce maison supplémentaire",
    price: 1000.0,
    image: "/extra-sauce-bowl-homemade.jpg",
  },
  {
    id: 4,
    name: "Jus maison",
    description: "Jus de fruits frais",
    price: 1000.0,
    image: "/fresh-homemade-fruit-juice.jpg",
  },
]

export function AddSupplements() {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ajouter des suppléments</h2>
            <p className="text-gray-600 text-sm">Ajoutez des éléments pour enrichir votre plat.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {supplements.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-28">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-1">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold text-sm">+ {item.price.toFixed(2)} f</span>
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
