interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  className?: string
}

export function PageHeader({ title, subtitle, badge, className = "" }: PageHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
      {badge && <p className="text-primary font-medium">{badge}</p>}
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
