import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateAction {
  label: string
  href: string
  variant?: "default" | "outline"
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actions?: EmptyStateAction[]
}

export function EmptyState({ icon: Icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className="text-center px-4 py-12">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant={action.variant || "default"}
                className={
                  action.variant === "outline"
                    ? "border-primary text-primary bg-transparent"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }
              >
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
