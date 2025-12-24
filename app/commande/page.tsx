"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { commandesApi } from "@/lib/api"
import { COMMUNES_KINSHASA, MODES_PAIEMENT } from "@/lib/constants"

export default function CommandePage() {
  const router = useRouter()
  const { items, sousTotal, fraisLivraison, tva, total, clearCart } = useCart()
  const { isAuthenticated, client, isLoading: authLoading } = useAuth()

  const [selectedPayment, setSelectedPayment] = useState<string>("airtel_money")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  // Montant en espèces annoncé par le client (format string pour contrôle de l'input)
  const [cashAmount, setCashAmount] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Kinshasa",
    commune: "",
    instructions: "",
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/connexion?redirect=/commande")
      } else if (items.length === 0) {
        router.push("/panier")
      }
    }
  }, [isAuthenticated, authLoading, items.length, router])

  useEffect(() => {
    if (client) {
      setFormData((prev) => ({
        ...prev,
        name: client.nom_complet,
        phone: client.telephone,
      }))
    }
  }, [client])

  // Helper to get item details
  const getItemDetails = (item: (typeof items)[0]) => {
    if (item.type === "simple" && item.plat) {
      return {
        name: item.plat.nom,
        description: item.variation ? `Taille: ${item.variation.taille}` : "",
        image: item.plat.image || "/placeholder.svg",
      }
    }

    if (item.type === "personnalise" && item.personnalisation) {
      const base = item.personnalisation.base
      const accNames = item.personnalisation.accompagnements.map((a) => a.plat.nom)
      const supNames = item.personnalisation.supplements.map((s) => s.plat.nom)

      return {
        name: base.plat.nom,
        description: [...accNames, ...supNames].join(" • ") || "Personnalisé",
        image: base.plat.image || "/placeholder.svg",
      }
    }

    return { name: "Plat", description: "", image: "/placeholder.svg" }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.commune) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Validation pour paiement à la livraison
    if (selectedPayment === "livraison") {
      if (!cashAmount) {
        setError("Veuillez indiquer le montant en espèces que vous aurez à la livraison")
        setIsSubmitting(false)
        return
      }
      const cashNum = Number(cashAmount)
      if (Number.isNaN(cashNum) || cashNum <= 0) {
        setError("Le montant en espèces doit être un nombre valide supérieur à 0")
        setIsSubmitting(false)
        return
      }
      if (cashNum < total) {
        setError("Le montant en espèces est inférieur au total de la commande")
        setIsSubmitting(false)
        return
      }
    }

    // Préparer les items pour l'API
    const commandeItems = items.map((item) => ({
      id_plat: item.type === "simple" ? item.plat?.id || "" : item.personnalisation?.base.plat.id || "",
      id_variation: item.variation?.id,
      quantite: item.quantite,
      prix_unitaire: item.prixUnitaire,
      personnalisation:
        item.type === "personnalise" && item.personnalisation
          ? {
              accompagnements: item.personnalisation.accompagnements.map((a) => ({
                id_plat: a.plat.id,
                id_variation: a.variation.id,
                quantite: a.quantite,
              })),
              supplements: item.personnalisation.supplements.map((s) => ({
                id_plat: s.plat.id,
                id_variation: s.variation.id,
                quantite: s.quantite,
              })),
            }
          : undefined,
    }))

    const payload: any = {
      adresse_livraison: formData.address,
      ville: formData.city,
      commune: formData.commune,
      instructions: formData.instructions,
      mode_paiement: selectedPayment as "airtel_money" | "mobile_cash" | "livraison",
      items: commandeItems,
    }

    // Inclure le montant en espèces (si applicable)
    if (selectedPayment === "livraison" && cashAmount) {
      payload.montant_en_especes = Number(cashAmount)
      // Pour compatibilité backend si non supporté, ajouter aussi dans les instructions
      payload.instructions = `${payload.instructions || ""}\nMontant en espèces annoncé: ${Number(cashAmount).toFixed(2)}f`
    }

    const response = await commandesApi.create(payload)

    setIsSubmitting(false)

    if (response.success && response.data) {
      clearCart()
      router.push(`/suivi?id=${response.data.id}`)
    } else {
      setError(response.error || "Erreur lors de la création de la commande")
    }
  }

  if (authLoading || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Finaliser votre commande</h1>
            <p className="text-muted-foreground">Complétez vos informations pour recevoir votre commande</p>
          </div>

          {error && (
            <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Delivery Information */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">Informations de livraison</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Entrez votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      placeholder="+243 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Input
                    id="address"
                    placeholder="Numéro, rue, quartier"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commune">Commune *</Label>
                    <Select
                      value={formData.commune}
                      onValueChange={(value) => setFormData({ ...formData, commune: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMUNES_KINSHASA.map((commune) => (
                          <SelectItem key={commune.id} value={commune.nom}>
                            {commune.nom} (+{commune.frais_livraison}f)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Précisions supplémentaires..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">Mode de paiement</h2>

                <div className="space-y-3">
                  {MODES_PAIEMENT.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? "border-primary" : "border-muted-foreground"
                        }`}
                      >
                        {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{method.nom}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Montant en espèces (si paiement à la livraison) */}
                {selectedPayment === "livraison" && (
                  <div className="mt-4">
                    <Label htmlFor="cash">Montant en espèces que vous aurez à la livraison *</Label>
                    <Input
                      id="cash"
                      type="number"
                      min={0}
                      placeholder="Entrez le montant exact en f"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Montant total: <span className="font-medium">{total.toFixed(2)}f</span>. {cashAmount && Number(cashAmount) >= total
                        ? `Monnaie à préparer: ${(Number(cashAmount) - total).toFixed(2)}f`
                        : cashAmount
                        ? "Le montant indiqué est inférieur au total"
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">Récapitulatif de commande</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const details = getItemDetails(item)
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <Image
                          src={details.image || "/placeholder.svg"}
                          alt={details.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{details.name}</h3>
                          <p className="text-sm text-muted-foreground">{details.description}</p>
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantite}</p>
                        </div>
                        <span className="font-semibold text-primary">{item.prixTotal.toFixed(2)}f</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{sousTotal.toFixed(2)}f</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frais de livraison</span>
                    <span>{fraisLivraison.toFixed(2)}f</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>TVA (16%)</span>
                    <span>{tva.toFixed(2)}f</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)}f</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Passer la commande"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé et crypté</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
