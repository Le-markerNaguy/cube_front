"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, Check, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { platsApi, type PlatResponse } from "@/lib/api"
import Link from "next/link"

export default function PersonnaliserPage() {
  const { addCustomItem } = useCart()
  const { isAuthenticated, client } = useAuth()
  const [added, setAdded] = useState(false)

  // Data states
  const [platsBase, setPlatsBase] = useState<PlatResponse[]>([])
  const [platsAccompagnement, setPlatsAccompagnement] = useState<PlatResponse[]>([])
  const [platsSupplément, setPlatsSupplément] = useState<PlatResponse[]>([])

  const defaultPlat: PlatResponse = {
    id: "",
    nom: "",
    description: "",
    type: "base",
    prix_base: 0,
    categorie: "",
    image: "",
    statut: "actif",
    statut_stock: "en_stock",
    variations: [],
    created_at: "",
    updated_at: "",
  }

  // Base selection
  const [selectedBaseId, setSelectedBaseId] = useState<string>("")
  const [selectedVariationTaille, setSelectedVariationTaille] = useState<string>("moyen")

  // Accompaniments (multiple selection with variations)
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<
    Record<string, { selected: boolean; taille: string }>
  >({})

  const [selectedSupplements, setSelectedSupplements] = useState<Record<string, { selected: boolean; taille: string }>>(
    {},
  )

  const [quantity, setQuantity] = useState(1)

  const selectedBase = platsBase.find((p) => p.id === selectedBaseId) || platsBase[0] || defaultPlat
  const selectedBaseVariation = selectedBase.variations?.find((v) => v.taille === selectedVariationTaille)

  // Calculate prices
  const basePrice = selectedBaseVariation?.prix || 0

  const accompanimentsPrice = Object.entries(selectedAccompaniments)
    .filter(([, value]) => value.selected)
    .reduce((sum, [id, value]) => {
      const plat = platsAccompagnement.find((p) => p.id === id)
      const variation = plat?.variations?.find((v) => v.taille === value.taille)
      return sum + (variation?.prix || 0)
    }, 0)

  const supplementsPrice = Object.entries(selectedSupplements)
    .filter(([, value]) => value.selected)
    .reduce((sum, [id, value]) => {
      const plat = platsSupplément.find((p) => p.id === id)
      const variation = plat?.variations?.find((v) => v.taille === value.taille)
      return sum + (variation?.prix || 0)
    }, 0)

  const subtotal = (basePrice + accompanimentsPrice + supplementsPrice) * quantity
  const tva = subtotal * 0.16
  const total = subtotal + tva

  const toggleAccompaniment = (id: string) => {
    setSelectedAccompaniments((prev) => ({
      ...prev,
      [id]: prev[id]?.selected ? { ...prev[id], selected: false } : { selected: true, taille: "moyen" },
    }))
  }

  const updateAccompanimentTaille = (id: string, taille: string) => {
    setSelectedAccompaniments((prev) => ({
      ...prev,
      [id]: { ...prev[id], taille },
    }))
  }

  const toggleSupplement = (id: string) => {
    setSelectedSupplements((prev) => ({
      ...prev,
      [id]: prev[id]?.selected ? { ...prev[id], selected: false } : { selected: true, taille: "moyen" },
    }))
  }

  const updateSupplementTaille = (id: string, taille: string) => {
    setSelectedSupplements((prev) => ({
      ...prev,
      [id]: { ...prev[id], taille },
    }))
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) return

    // Build accompaniments array
    const accompagnementsArray = Object.entries(selectedAccompaniments)
      .filter(([, value]) => value.selected)
      .map(([id, value]) => {
        const plat = platsAccompagnement.find((p) => p.id === id)!
        const variation = plat.variations?.find((v) => v.taille === value.taille)!
        return { plat, variation, quantite: 1 }
      })

    const supplementsArray = Object.entries(selectedSupplements)
      .filter(([, value]) => value.selected)
      .map(([id, value]) => {
        const plat = platsSupplément.find((p) => p.id === id)!
        const variation = plat.variations?.find((v) => v.taille === value.taille)!
        return { plat, variation, quantite: 1 }
      })

    const personnalisation = {
      base: { plat: selectedBase, variation: selectedBaseVariation! },
      accompagnements: accompagnementsArray,
      supplements: supplementsArray,
    }

    addCustomItem(personnalisation, quantity)
    setAdded(true)

    setTimeout(() => setAdded(false), 2000)
  }

  useEffect(() => {
    let mounted = true
    async function loadPlats() {
      try {
        const [basesRes, accRes, supRes] = await Promise.all([
          platsApi.getBases(),
          platsApi.getAccompagnements(),
          platsApi.getSupplements(),
        ])

        if (!mounted) return

        if (basesRes.success) setPlatsBase(basesRes.data || [])
        if (accRes.success) setPlatsAccompagnement(accRes.data || [])
        if (supRes.success) setPlatsSupplément(supRes.data || [])

        if (basesRes.success && (basesRes.data || []).length > 0) {
          setSelectedBaseId((basesRes.data || [])[0].id)
        }
      } catch (e) {
        console.error("Failed to load plats:", e)
      }
    }

    loadPlats()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Personnalise ton repas</h1>
            <p className="text-muted-foreground">Crée le plat parfait selon tes envies et tes goûts</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Selection Sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section 1: Base */}
              <Card>
                <CardHeader>
                  <p className="text-sm text-primary font-medium">SECTION 1</p>
                  <CardTitle>Choisir la base</CardTitle>
                  <p className="text-sm text-muted-foreground">Sélectionne l&apos;élément principal de ton plat</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {platsBase.map((base) => (
                      <div
                        key={base.id}
                        onClick={() => setSelectedBaseId(base.id)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedBaseId === base.id
                            ? "border-primary shadow-lg"
                            : "border-transparent hover:border-muted"
                        }`}
                      >
                        <Image
                          src={base.image || "/placeholder.svg"}
                          alt={base.nom}
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 bg-card">
                          <h4 className="font-medium text-sm">{base.nom}</h4>
                          <p className="text-xs text-muted-foreground">{base.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Variation Selection */}
                  <div className="flex items-center gap-4 mt-4 p-4 bg-secondary/30 rounded-lg">
                    <span className="text-sm font-medium">Taille:</span>
                    <Select value={selectedVariationTaille} onValueChange={setSelectedVariationTaille}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBase.variations?.map((v) => (
                          <SelectItem key={v.id} value={v.taille}>
                            {v.taille.charAt(0).toUpperCase() + v.taille.slice(1)} - {v.prix.toFixed(2)}f
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-primary font-bold ml-auto">{basePrice.toFixed(2)}f</span>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Accompaniments */}
              <Card>
                <CardHeader>
                  <p className="text-sm text-primary font-medium">SECTION 2</p>
                  <CardTitle>Choisir les accompagnements</CardTitle>
                  <p className="text-sm text-muted-foreground">Ajoute un ou plusieurs accompagnements selon ton goût</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {platsAccompagnement.map((item) => {
                      const isSelected = selectedAccompaniments[item.id]?.selected
                      const selectedTaille = selectedAccompaniments[item.id]?.taille || "moyen"

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox checked={isSelected} onCheckedChange={() => toggleAccompaniment(item.id)} />
                          <span className="font-medium flex-1">{item.nom}</span>

                          {isSelected && (
                            <Select
                              value={selectedTaille}
                              onValueChange={(val) => updateAccompanimentTaille(item.id, val)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {item.variations?.map((v) => (
                                  <SelectItem key={v.id} value={v.taille}>
                                    {v.taille.charAt(0).toUpperCase() + v.taille.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          <span className="text-primary text-sm">
                            +{item.variations?.find((v) => v.taille === selectedTaille)?.prix.toFixed(2)}f
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Supplements - Now with 3 sizes */}
              <Card>
                <CardHeader>
                  <p className="text-sm text-primary font-medium">SECTION 3</p>
                  <CardTitle>Suppléments</CardTitle>
                  <p className="text-sm text-muted-foreground">Ajoute un extra pour rendre ton plat meilleur</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {platsSupplément.map((item) => {
                      const isSelected = selectedSupplements[item.id]?.selected
                      const selectedTaille = selectedSupplements[item.id]?.taille || "moyen"

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox checked={isSelected} onCheckedChange={() => toggleSupplement(item.id)} />
                          <span className="font-medium flex-1">{item.nom}</span>

                          {isSelected && (
                            <Select
                              value={selectedTaille}
                              onValueChange={(val) => updateSupplementTaille(item.id, val)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {item.variations?.map((v) => (
                                  <SelectItem key={v.id} value={v.taille}>
                                    {v.taille.charAt(0).toUpperCase() + v.taille.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          <span className="text-primary text-sm">
                            +{item.variations?.find((v) => v.taille === selectedTaille)?.prix.toFixed(2)}f
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recap Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Image
                    src={selectedBase.image || "/placeholder.svg"}
                    alt={selectedBase.nom}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">BASE</p>
                      <div className="flex justify-between">
                        <span>
                          {selectedBase.nom} ({selectedVariationTaille})
                        </span>
                        <span className="text-primary">{basePrice.toFixed(2)}f</span>
                      </div>
                    </div>

                    {Object.entries(selectedAccompaniments).filter(([, v]) => v.selected).length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">ACCOMPAGNEMENTS</p>
                        {Object.entries(selectedAccompaniments)
                          .filter(([, v]) => v.selected)
                          .map(([id, value]) => {
                            const plat = platsAccompagnement.find((p) => p.id === id)
                            const variation = plat?.variations?.find((v) => v.taille === value.taille)
                            return (
                              <div key={id} className="flex justify-between">
                                <span>
                                  {plat?.nom} ({value.taille})
                                </span>
                                <span className="text-primary">{variation?.prix.toFixed(2)}f</span>
                              </div>
                            )
                          })}
                      </div>
                    )}

                    {Object.entries(selectedSupplements).filter(([, v]) => v.selected).length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">SUPPLÉMENTS</p>
                        {Object.entries(selectedSupplements)
                          .filter(([, v]) => v.selected)
                          .map(([id, value]) => {
                            const plat = platsSupplément.find((p) => p.id === id)
                            const variation = plat?.variations?.find((v) => v.taille === value.taille)
                            return (
                              <div key={id} className="flex justify-between">
                                <span>
                                  {plat?.nom} ({value.taille})
                                </span>
                                <span className="text-primary">{variation?.prix.toFixed(2)}f</span>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)}f</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>TVA (16%)</span>
                      <span>{tva.toFixed(2)}f</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{total.toFixed(2)}f</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {isAuthenticated ? (
                    <Button
                      onClick={handleAddToCart}
                      disabled={added}
                      className={`w-full py-6 text-lg rounded-full transition-all ${
                        added ? "bg-green-500 hover:bg-green-500" : "bg-primary hover:bg-primary/90"
                      } text-primary-foreground`}
                    >
                      {added ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Ajouté au panier
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Ajouter au panier
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-center text-muted-foreground">Connectez-vous pour ajouter au panier</p>
                      <Link href="/connexion">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-full">
                          Se connecter
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
