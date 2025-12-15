"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { WhyPersonalizationSection } from "@/components/home/why-personalization-section";
import { StepsSection } from "@/components/home/steps-section";
import { PopularDishesSection } from "@/components/home/popular-dishes-section";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Wallet,
  Salad,
  CheckCircle,
  UserPlus,
  UtensilsCrossed,
  ListChecks,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDishes } from "@/contexts/dishes-context";
import { useCart } from "@/contexts/cart-context";

const benefits = [
  {
    icon: Heart,
    title: "Goûts personnels",
    description:
      "Chaque bouchée à vos goûts et envies. Créez votre plat comme vous l'aimez vraiment.",
  },
  {
    icon: Wallet,
    title: "Budget flexible",
    description:
      "Vous choisissez vos quantités selon votre budget. Dépensez ce que vous voulez.",
  },
  {
    icon: Salad,
    title: "Contrôle santé",
    description:
      "Un rééquilibrage est crucial le soir. Mangez sainement en personnalisant vos plats.",
  },
  {
    icon: CheckCircle,
    title: "Liberté de choix",
    description:
      "Mangez ce que vous aimez vraiment chaque jour en changeant de plat.",
  },
];

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Créer un compte",
    description:
      "Inscrivez-vous pour profiter de nos avantages et commandez en quelques secondes.",
  },
  {
    number: "2",
    icon: UtensilsCrossed,
    title: "Choisir un plat",
    description:
      "Sélectionnez votre plat de base ou personnalisez complètement votre repas.",
  },
  {
    number: "3",
    icon: ListChecks,
    title: "Sélectionner quantités",
    description: "Ajustez les quantités selon vos envies et votre appétit.",
  },
  {
    number: "4",
    icon: CreditCard,
    title: "Payer et suivre",
    description:
      "Payez en ligne et suivez votre commande en temps réel jusqu'à la livraison.",
  },
];

export default function HomePage() {
  const { popularDishes, isLoading } = useDishes();
  const { addSimpleItem } = useCart();

  const handleAddToCart = (dish: any) => {
    addSimpleItem(dish);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Compose ton repas
              <br />
              <span className="text-primary">comme tu l&apos;aimes</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Un service simple, rapide et sur mesure pour créer le repas
              parfait. Choisissez les ingrédients, les quantités et ton budget.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/personnaliser">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3">
                  Personnaliser mon plat
                </Button>
              </Link>
              <Link href="/menu">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 bg-transparent"
                >
                  Explorer le menu
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/delicious-food-bowls-overhead.jpg"
              alt="Plats délicieux"
              width={500}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <WhyPersonalizationSection />

      <StepsSection
        title="Comment ça marche ?"
        subtitle="4 étapes simples pour créer votre repas personnalisé"
        steps={steps}
        ctaLabel="Créer mon compte"
        ctaHref="/inscription"
      />

      {isLoading ? (
        <section className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </section>
      ) : (
        <PopularDishesSection
          title="Plats populaires"
          subtitle="Découvrez nos plats les plus commandés, tous personnalisables à votre goût"
          dishes={popularDishes}
          onAddToCart={handleAddToCart}
        />
      )}
    </PageLayout>
  );
}
