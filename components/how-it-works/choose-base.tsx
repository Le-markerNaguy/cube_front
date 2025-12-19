"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface BasePlat {
  id: number;
  name: string;
  description: string;
  price: number; // FCFA
  image: string;
}

const bases: BasePlat[] = [
  {
    id: 1,
    name: "Poulet braisé",
    description: "Poulet tendre parfaitement assaisonné",
    price: 3500,
    image: "/grilled-chicken-braise-african-style.jpg",
  },
  {
    id: 2,
    name: "Poisson grillé",
    description: "Filet de poisson frais grillé",
    price: 4000,
    image: "/grilled-fish-with-vegetables.jpg",
  },
  {
    id: 3,
    name: "Boulettes de viande",
    description: "Boulettes maison savoureuses",
    price: 3000,
    image: "/meatballs-in-sauce.jpg",
  },
  {
    id: 4,
    name: "Sandwich maison",
    description: "Pain frais garni généreusement",
    price: 2500,
    image: "/homemade-sandwich-fresh-bread.jpg",
  },
  {
    id: 5,
    name: "Riz cantonnais",
    description: "Riz sauté aux légumes",
    price: 2800,
    image: "/cantonese-fried-rice-vegetables.jpg",
  },
];

export function ChooseBase() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            1
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Choisissez votre base
            </h2>
            <p className="text-gray-600 text-sm max-w-md">
              La base est l’élément principal de votre plat. Exemple : poulet,
              poisson ou riz.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {bases.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl overflow-hidden border hover:shadow-md transition"
            >
              <div className="relative h-32">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-orange-500 font-bold text-sm">
                    {item.price.toLocaleString("fr-FR")} FCFA
                  </span>

                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 h-7 rounded-full flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Choisir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Example */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">💡 Exemple</p>
          <p>
            Base choisie : <strong>Poulet braisé</strong> — 3 500 FCFA
          </p>
        </div>
      </div>
    </section>
  );
}
