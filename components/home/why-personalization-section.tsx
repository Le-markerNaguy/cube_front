"use client";

import Image from "next/image";

export function WhyPersonalizationSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-20">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi la personnalisation de votre repas change tout
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez comment composer un plat unique qui correspond
            parfaitement à vos goûts, votre budget et votre style de vie.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-primary font-semibold">SECTION 1</p>
            <h3 className="text-2xl font-bold">Manger selon ses envies</h3>
            <p className="text-muted-foreground">
              Chaque personne a ses préférences. La personnalisation permet
              d’éviter les ingrédients que vous n’aimez pas et de renforcer ceux
              que vous appréciez.
            </p>

            <div className="bg-background rounded-xl border p-4">
              <p className="font-semibold mb-2">Exemple de personnalisation</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Base : Poulet braisé</li>
                <li>Accompagnements : Riz + Plantain</li>
                <li>Supplement : Sauce tomate légèrement épicée</li>
              </ul>
            </div>
          </div>

          <Image
            src="/food3.webp"
            alt="Bol personnalisé"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg  ml-0 sm:ml-4 md:ml-8 lg:ml-16"
          />
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="/budget1.jpg"
            alt="Budget maîtrisé"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg   w-full max-w-[500px] h-auto object-cover"
          />

          <div className="space-y-4">
            <p className="text-primary font-semibold">SECTION 2</p>
            <h3 className="text-2xl font-bold">Maîtriser son budget</h3>
            <p className="text-muted-foreground">
              Cube permet d’adapter votre plat à votre portefeuille. Vous
              choisissez la portion, les accompagnements et les suppléments.
            </p>

            <div className="bg-background rounded-xl border p-4">
              <p className="font-semibold mb-2">Exemple budget</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Base : Poisson grillé — 3 000 FCFA</li>
                <li>Accompagnement : Attiéké — 800 FCFA</li>
                <li>Supplément légumes sautés — +700 FCFA</li>
                <li className="font-semibold">Total du plat : 4 500 FCFA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-primary font-semibold">SECTION 3</p>
            <h3 className="text-2xl font-bold">Une expérience unique</h3>
            <p className="text-muted-foreground">
              Composer son repas crée une vraie expérience personnalisée. Chaque
              client repart avec un plat qui lui ressemble.
            </p>

            <div className="bg-background rounded-xl border p-4">
              <p className="font-semibold mb-2">Exemple expérience</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Choix du plat selon l’humeur</li>
                <li>Personnalisation nutritionnelle</li>
                <li>Commande rapide et fluide</li>
              </ul>
            </div>
          </div>

          <Image
            src="/food2.webp"
            alt="Expérience unique"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg   ml-0 sm:ml-4 md:ml-8 lg:ml-16"
          />
        </div>
      </div>
    </section>
  );
}
