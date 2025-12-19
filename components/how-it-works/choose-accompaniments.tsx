/* =============================
ChooseAccompaniments.tsx
============================= */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Accompaniment {
  id: number;
  name: string;
  description: string;
  price: number; // FCFA
  image: string;
}

const accompaniments: Accompaniment[] = [
  {
    id: 1,
    name: "Frites",
    description: "Frites croustillantes maison",
    price: 500,
    image: "/french-fries-crispy-golden.jpg",
  },
  {
    id: 2,
    name: "Riz parfumé",
    description: "Riz basmati parfumé",
    price: 500,
    image: "/fragrant-basmati-rice.jpg",
  },
  {
    id: 3,
    name: "Plantains grillés",
    description: "Plantains mûrs grillés",
    price: 300,
    image: "/grilled-plantains-african.jpg",
  },
  {
    id: 4,
    name: "Légumes sautés",
    description: "Mélange de légumes frais",
    price: 2000,
    image: "/sauteed-mixed-vegetables.jpg",
  },
  {
    id: 5,
    name: "Attiéké",
    description: "Semoule de manioc traditionnelle",
    price: 600,
    image: "/attieke-cassava-couscous-african.jpg",
  },
];

export function ChooseAccompaniments() {
  return (
    <section className="py-10 px-4 bg-orange-50/60">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Choisissez vos accompagnements
            </h2>
            <p className="text-gray-600 text-sm">
              Vous pouvez en sélectionner plusieurs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {accompaniments.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-28">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-orange-500 font-bold text-sm">
                    + {item.price.toLocaleString("fr-FR")} FCFA
                  </span>
                  <Button
                    size="sm"
                    className="rounded-full h-7 px-3 text-xs flex gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
