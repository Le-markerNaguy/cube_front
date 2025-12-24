"use client"

import Image from "next/image"

export function WhyPersonalizationSection() {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Intro */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance">
            Pourquoi la personnalisation de votre repas change tout
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Composez un plat qui correspond parfaitement à vos goûts, votre budget et votre style de vie.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch mb-32 max-w-7xl mx-auto">
          <div className="space-y-8">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide">
              SECTION 1
            </span>
            <h3 className="text-3xl md:text-4xl font-bold">Manger selon ses envies</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Chaque personne a ses préférences. La personnalisation permet d'éliminer les ingrédients indésirables et
              de valoriser ceux que vous aimez vraiment.
            </p>

            <div className="bg-muted/30 rounded-3xl border-2 border-border p-8 shadow-sm hover:shadow-lg transition-all hover:border-primary/30">
              <p className="font-bold mb-4 text-foreground text-lg">Exemple de personnalisation</p>
              <ul className="text-base text-muted-foreground list-disc pl-6 space-y-3">
                <li>Base : Poulet braisé</li>
                <li>Accompagnements : Riz + Plantain</li>
                <li>Supplément : Sauce tomate légèrement épicée</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/food3.webp"
                alt="Bol personnalisé"
                fill
                className="rounded-sm shadow-2xl object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 max-w-7xl mx-auto">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/budget1.jpg"
                alt="Budget maîtrisé"
                fill
                className="rounded-sm shadow-2xl object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide">
              SECTION 2
            </span>
            <h3 className="text-3xl md:text-4xl font-bold">Maîtriser son budget</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Adaptez votre plat à votre portefeuille. Vous contrôlez les portions, les accompagnements et les
              suppléments.
            </p>

            <div className="bg-muted/30 rounded-3xl border-2 border-border p-8 shadow-sm hover:shadow-lg transition-all hover:border-primary/30">
              <p className="font-bold mb-4 text-foreground text-lg">Exemple de budget</p>
              <ul className="text-base text-muted-foreground list-disc pl-6 space-y-3">
                <li>Base : Poisson grillé — 3 000 FCFA</li>
                <li>Accompagnement : Attiéké — 800 FCFA</li>
                <li>Supplément : Légumes sautés — +700 FCFA</li>
                <li className="font-bold text-foreground">Total : 4 500 FCFA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide">
              SECTION 3
            </span>
            <h3 className="text-3xl md:text-4xl font-bold">Une expérience unique</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Composer son repas devient une expérience fluide et agréable. Chaque client repart avec un plat qui lui
              ressemble.
            </p>

            <div className="bg-muted/30 rounded-3xl border-2 border-border p-8 shadow-sm hover:shadow-lg transition-all hover:border-primary/30">
              <p className="font-bold mb-4 text-foreground text-lg">Exemple d'expérience</p>
              <ul className="text-base text-muted-foreground list-disc pl-6 space-y-3">
                <li>Choix du plat selon l'humeur</li>
                <li>Personnalisation nutritionnelle</li>
                <li>Commande rapide et intuitive</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/food2.webp"
                alt="Expérience unique"
                fill
                className="rounded-sm shadow-2xl object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
