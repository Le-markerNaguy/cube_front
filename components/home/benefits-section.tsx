import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

interface BenefitsSectionProps {
  title: string
  benefits: Benefit[]
}

export function BenefitsSection({ title, benefits }: BenefitsSectionProps) {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-card border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
