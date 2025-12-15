"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

interface OrderSummaryProps {
  sousTotal: number
  fraisLivraison: number
  tva: number
  total: number
  isAuthenticated: boolean
  onSubmit?: () => void
  submitLabel?: string
  submitHref?: string
  isSubmitting?: boolean
  showSecurityNote?: boolean
}

export function OrderSummary({
  sousTotal,
  fraisLivraison,
  tva,
  total,
  isAuthenticated,
  onSubmit,
  submitLabel = "Passer la commande",
  submitHref,
  isSubmitting = false,
  showSecurityNote = true,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{sousTotal.toFixed(2)}f</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frais de livraison</span>
            <span>{fraisLivraison.toFixed(2)}f</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TVA (16%)</span>
            <span>{tva.toFixed(2)}f</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span className="text-primary">{total.toFixed(2)}f</span>
          </div>
        </div>

        {isAuthenticated ? (
          submitHref ? (
            <Link href={submitHref} className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-full">
                {submitLabel}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-full"
            >
              {submitLabel}
            </Button>
          )
        ) : (
          <div className="space-y-3">
            <Link href="/connexion" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-full">
                Se connecter pour commander
              </Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        )}

        {showSecurityNote && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <Shield className="w-4 h-4" />
            Paiement 100% sécurisé et crypté
          </div>
        )}
      </CardContent>
    </Card>
  )
}
