"use client"

import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: { button: "w-8 h-8", text: "text-lg w-6" },
  md: { button: "w-10 h-10", text: "text-xl w-8" },
  lg: { button: "w-12 h-12", text: "text-2xl w-10" },
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const classes = sizeClasses[size]

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={`${classes.button} rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className={`${classes.text} font-bold text-center`}>{quantity}</span>
      <button
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${classes.button} rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
