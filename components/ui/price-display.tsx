interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "primary" | "muted" | "default"
  className?: string
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
}

const variantClasses = {
  primary: "text-primary font-bold",
  muted: "text-muted-foreground",
  default: "text-foreground",
}

export function PriceDisplay({
  amount,
  currency = "f",
  size = "md",
  variant = "primary",
  className = "",
}: PriceDisplayProps) {
  return (
    <span className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {amount.toFixed(2)}
      {currency}
    </span>
  )
}
