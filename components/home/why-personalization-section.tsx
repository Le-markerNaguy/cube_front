"use client";

import Image from "next/image";

export function WhyPersonalizationSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Pourquoi la personnalisation de votre repas change tout
          </h2>
          <p className="text-muted-foreground text-lg">
            Composez un plat qui correspond parfaitement à vos goûts, votre
            budget et votre style de vie.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <span className="text-primary font-semibold tracking-wide">
              SECTION 1
            </span>
            <h3 className="text-2xl font-bold">Manger selon ses envies</h3>
            <p className="text-muted-foreground">
              Chaque personne a ses préférences. La personnalisation permet
              d’éliminer les ingrédients indésirables et de valoriser ceux que
              vous aimez vraiment.
            </p>

            <div className="bg-background rounded-2xl border p-5 shadow-sm">
              <p className="font-semibold mb-3">Exemple de personnalisation</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
                <li>Base : Poulet braisé</li>
                <li>Accompagnements : Riz + Plantain</li>
                <li>Supplément : Sauce tomate légèrement épicée</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/food3.webp"
              alt="Bol personnalisé"
              width={520}
              height={420}
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <Image
              src="/budget1.jpg"
              alt="Budget maîtrisé"
              width={520}
              height={420}
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <span className="text-primary font-semibold tracking-wide">
              SECTION 2
            </span>
            <h3 className="text-2xl font-bold">Maîtriser son budget</h3>
            <p className="text-muted-foreground">
              Adaptez votre plat à votre portefeuille. Vous contrôlez les
              portions, les accompagnements et les suppléments.
            </p>

            <div className="bg-background rounded-2xl border p-5 shadow-sm">
              <p className="font-semibold mb-3">Exemple de budget</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
                <li>Base : Poisson grillé — 3 000 FCFA</li>
                <li>Accompagnement : Attiéké — 800 FCFA</li>
                <li>Supplément : Légumes sautés — +700 FCFA</li>
                <li className="font-semibold text-foreground">
                  Total : 4 500 FCFA
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary font-semibold tracking-wide">
              SECTION 3
            </span>
            <h3 className="text-2xl font-bold">Une expérience unique</h3>
            <p className="text-muted-foreground">
              Composer son repas devient une expérience fluide et agréable.
              Chaque client repart avec un plat qui lui ressemble.
            </p>

            <div className="bg-background rounded-2xl border p-5 shadow-sm">
              <p className="font-semibold mb-3">Exemple d’expérience</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
                <li>Choix du plat selon l’humeur</li>
                <li>Personnalisation nutritionnelle</li>
                <li>Commande rapide et intuitive</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/food2.webp"
              alt="Expérience unique"
              width={520}
              height={420}
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
