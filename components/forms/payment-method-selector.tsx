"use client"

import type { ModePaiement } from "@/lib/types"

interface PaymentMethod {
  id: ModePaiement
  name: string
  description: string
  icon: string
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selectedMethod: ModePaiement
  onMethodChange: (method: ModePaiement) => void
}

export function PaymentMethodSelector({ methods, selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={(e) => onMethodChange(e.target.value as ModePaiement)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method.id ? "border-primary" : "border-muted-foreground"
            }`}
          >
            {selectedMethod === method.id && <div className="w-3 h-3 rounded-full bg-primary" />}
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{method.name}</p>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
          <span className="text-2xl">{method.icon}</span>
        </label>
      ))}
    </div>
  )
}
