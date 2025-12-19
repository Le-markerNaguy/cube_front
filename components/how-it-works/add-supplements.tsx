/* =============================
AddSupplements.tsx
============================= */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Supplement {
  id: number;
  name: string;
  description: string;
  price: number; // FCFA
  image: string;
}

const supplements: Supplement[] = [
  {
    id: 1,
    name: "Fromage fondu",
    description: "Fromage crémeux fondu",
    price: 2000,
    image: "/melted-cheese-topping.jpg",
  },
  {
    id: 2,
    name: "Double viande",
    description: "Double portion de viande",
    price: 1500,
    image: "/extra-meat-portion-grilled.jpg",
  },
  {
    id: 3,
    name: "Extra sauce",
    description: "Sauce maison supplémentaire",
    price: 1000,
    image: "/extra-sauce-bowl-homemade.jpg",
  },
  {
    id: 4,
    name: "Jus maison",
    description: "Jus de fruits frais",
    price: 1000,
    image: "/fresh-homemade-fruit-juice.jpg",
  },
];

export function AddSupplements() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ajoutez des suppléments</h2>
            <p className="text-gray-600 text-sm">Pour enrichir votre plat</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {supplements.map((item) => (
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
                    <Sparkles className="w-3 h-3" /> Ajouter
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
