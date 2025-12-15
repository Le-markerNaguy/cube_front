import Image from "next/image"
import { Check, Clock, Settings, Sparkles } from "lucide-react"

const features = [
  {
    icon: Check,
    text: "Interface simple et intuitive",
  },
  {
    icon: Clock,
    text: "Prix transparents en temps réel",
  },
  {
    icon: Settings,
    text: "Contrôle total de votre commande",
  },
  {
    icon: Sparkles,
    text: "Personnalisation illimitée",
  },
]

export function IntuitiveExperience() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Une expérience intuitive</h2>
            <p className="text-gray-600 mb-6">
              Cube propose une interface simple, claire et rapide pour personnaliser votre repas. Vous gardez le
              contrôle du contenu et du prix.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src="/happy-couple-cooking-together-kitchen-smiling.jpg" alt="Couple cuisinant ensemble" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
