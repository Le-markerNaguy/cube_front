import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface Step {
  number: string
  icon: LucideIcon
  title: string
  description: string
}

interface StepsSectionProps {
  title: string
  subtitle: string
  steps: Step[]
  ctaLabel?: string
  ctaHref?: string
}

export function StepsSection({ title, subtitle, steps, ctaLabel, ctaHref }: StepsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        <p className="text-muted-foreground text-center mb-12">{subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="text-center mt-12">
            <Link href={ctaHref}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3">{ctaLabel}</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
