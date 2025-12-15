import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SectionCardProps {
  title: string
  subtitle?: string
  sectionLabel?: string
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export function SectionCard({
  title,
  subtitle,
  sectionLabel,
  children,
  className = "",
  sticky = false,
}: SectionCardProps) {
  return (
    <Card className={`${sticky ? "sticky top-24" : ""} ${className}`}>
      <CardHeader>
        {sectionLabel && <p className="text-sm text-primary font-medium">{sectionLabel}</p>}
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
