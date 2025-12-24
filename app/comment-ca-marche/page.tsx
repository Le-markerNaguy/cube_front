"use client";

import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-16 text-center bg-zinc-100">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Comment fonctionne la personnalisation chez Cube ?
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Chez Cube, vous composez votre plat étape par étape. Chaque élément
          possède plusieurs quantités, avec un prix adapté à votre budget.
        </p>
      </section>

      {/* Step 1 */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-orange-500 font-semibold">ÉTAPE 1</span>
            <h2 className="text-2xl font-bold">Choisissez votre base</h2>
            <p className="text-gray-600">
              La base est l’élément principal de votre plat (poulet, poisson,
              riz…). Chaque base est disponible en trois quantités.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
              <p className="font-semibold">Exemple : Poulet braisé</p>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li>Petite portion — 2 500 FCFA</li>
                <li>Portion moyenne — 3 500 FCFA</li>
                <li>Grande portion — 4 500 FCFA</li>
              </ul>
            </div>
          </div>

          <Image
            src="/poulet-braise.webp"
            alt="Base du plat"
            width={500}
            height={400}
            className="rounded-sm shadow-lg"
          />
        </div>
      </section>

      {/* Step 2 */}
      <section className="py-14 px-4 bg-zinc-100">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="/Attieke.webp"
            alt="Accompagnements"
            width={500}
            height={400}
            className="rounded-sm shadow-lg"
          />

          <div className="space-y-4">
            <span className="text-orange-500 font-semibold">ÉTAPE 2</span>
            <h2 className="text-2xl font-bold">Ajoutez vos accompagnements</h2>
            <p className="text-gray-600">
              Les accompagnements complètent votre plat. Vous pouvez en choisir
              un ou plusieurs, chacun avec trois niveaux de quantité.
            </p>

            <div className="bg-white rounded-xl p-4 border space-y-2">
              <p className="font-semibold">Exemple : Attiéké</p>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li>Petite portion — +300 FCFA</li>
                <li>Portion moyenne — +600 FCFA</li>
                <li>Grande portion — +1 000 FCFA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-orange-500 font-semibold">ÉTAPE 3</span>
            <h2 className="text-2xl font-bold">Ajoutez des suppléments</h2>
            <p className="text-gray-600">
              Les suppléments vous permettent d’enrichir votre plat selon vos
              envies, avec un contrôle total du prix.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
              <p className="font-semibold">Exemple : Légumes premium</p>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li>Petit supplément — + 600 FCFA</li>
                <li>Supplément standard — +1 000 FCFA</li>
                <li>Supplément généreux — +1 800 FCFA</li>
              </ul>
            </div>
          </div>

          <Image
            src="/legumes-sautes.jpeg"
            alt="Suppléments"
            width={500}
            height={400}
            className="rounded-sm shadow-lg"
          />
        </div>
      </section>

      {/* Pricing Explanation */}
      <section className="py-16 px-4 bg-zinc-100">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-2xl font-bold text-orange-500">Un prix clair et flexible</h2>
          <p className="text-gray-600">
            Le prix final dépend uniquement des quantités choisies. Plus vous
            ajoutez d’éléments ou augmentez les portions, plus le prix s’ajuste.
          </p>

          <div className="bg-white rounded-sm shadow-lg p-6 text-left space-y-3">
            <p className="font-semibold">Exemple de calcul :</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Base : Poulet braisé (portion moyenne) — 3 500 FCFA</li>
              <li>Accompagnement : Attiéké (portion moyenne) — +600 FCFA</li>
              <li>Supplément : Légumes premium (standard) — +1 000 FCFA</li>
            </ul>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-orange-500">5 100 FCFA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Une personnalisation à votre image</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Cube vous permet de composer un plat unique, adapté à vos goûts et à
          votre budget, grâce à des quantités flexibles et transparentes.
        </p>
      </section>

      <Footer />
    </div>
  );
}
