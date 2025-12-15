"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

const accompaniments = [
  {
    id: 1,
    name: "Frites",
    description: "Frites croustillantes maison",
    price: 500.0,
    image: "/french-fries-crispy-golden.jpg",
  },
  {
    id: 2,
    name: "Riz parfumé",
    description: "Riz basmati parfumé",
    price: 500.0,
    image: "/fragrant-basmati-rice.jpg",
  },
  {
    id: 3,
    name: "Plantains grillés",
    description: "Plantains mûrs grillés",
    price: 300.0,
    image: "/grilled-plantains-african.jpg",
  },
  {
    id: 4,
    name: "Légumes sautés",
    description: "Mélange de légumes frais",
    price: 2000.0,
    image: "/sauteed-mixed-vegetables.jpg",
  },
  {
    id: 5,
    name: "Attiéké",
    description: "Semoule de manioc traditionnelle",
    price: 600.0,
    image: "/attieke-cassava-couscous-african.jpg",
  },
]

export function ChooseAccompaniments() {
  return (
    <section className="py-8 px-4 bg-orange-50/50">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choisir vos accompagnements</h2>
            <p className="text-gray-600 text-sm">Sélectionnez un ou plusieurs accompagnements.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {accompaniments.map((item) => (
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
