"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/layout/page-layout"
import { PageHeader } from "@/components/layout/page-header"
import { OrderTimeline } from "@/components/order/order-timeline"
import { OrderItemDisplay } from "@/components/order/order-item-display"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, HelpCircle, Loader2, Banknote } from "lucide-react"
import Link from "next/link"
import { commandesApi, type CommandeResponse } from "@/lib/api"
import { STATUTS_COMMANDE } from "@/lib/constants"

// Fonction pour générer les étapes de suivi
function generateOrderSteps(commande: CommandeResponse) {
  const steps = [
    {
      id: 1,
      title: "Commande confirmée",
      time: commande.date_confirmation
        ? new Date(commande.date_confirmation).toLocaleString("fr-FR")
        : new Date(commande.date_commande).toLocaleString("fr-FR"),
      description: "Votre commande a été reçue et confirmée",
      completed: true,
      active: commande.statut_commande === "confirmee",
    },
    {
      id: 2,
      title: "En préparation",
      time: commande.date_preparation ? new Date(commande.date_preparation).toLocaleString("fr-FR") : "En attente",
      description: "Notre équipe prépare votre commande avec soin",
      completed: ["en_preparation", "en_livraison", "livree"].includes(commande.statut_commande),
      active: commande.statut_commande === "en_preparation",
    },
    {
      id: 3,
      title: "Départ livraison",
      time: commande.date_depart_livraison
        ? new Date(commande.date_depart_livraison).toLocaleString("fr-FR")
        : "En attente",
      description: "Le livreur part avec votre commande",
      completed: ["en_livraison", "livree"].includes(commande.statut_commande),
      active: false,
    },
    {
      id: 4,
      title: "En cours de livraison",
      time: commande.date_depart_livraison ? "En cours" : "En attente",
      description: "Le livreur est en route vers votre adresse",
      completed: ["livree"].includes(commande.statut_commande),
      active: commande.statut_commande === "en_livraison",
    },
    {
      id: 5,
      title: "Livrée",
      time: commande.date_livree ? new Date(commande.date_livree).toLocaleString("fr-FR") : "En attente",
      description: "Commande livrée avec succès",
      completed: commande.statut_commande === "livree",
      active: false,
    },
  ]

  return steps
}

export default function SuiviPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const [commande, setCommande] = useState<CommandeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCommande = async () => {
      if (!orderId) {
        setError("Numéro de commande non spécifié")
        setIsLoading(false)
        return
      }

      const response = await commandesApi.getById(orderId)

      if (response.success && response.data) {
        setCommande(response.data)
      } else {
        setError(response.error || "Commande introuvable")
      }

      setIsLoading(false)
    }

    fetchCommande()

    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchCommande, 30000)
    return () => clearInterval(interval)
  }, [orderId])

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    )
  }

  if (error || !commande) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
          <p className="text-muted-foreground mb-6">{error || "La commande demandée n'existe pas."}</p>
          <Link href="/mes-commandes">
            <Button>Voir mes commandes</Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  const orderSteps = generateOrderSteps(commande)
  const currentStatus =
    STATUTS_COMMANDE[commande.statut_commande as keyof typeof STATUTS_COMMANDE]?.label || commande.statut_commande

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <PageHeader title="Suivi de votre commande" badge={`Commande #${commande.id}`} className="mb-8 md:mb-12" />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Timeline */}
          <OrderTimeline steps={orderSteps} currentStatus={currentStatus} />

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Détails de la commande</h2>
              <div className="space-y-4">
                {commande.lignes.map((item) => (
                  <OrderItemDisplay
                    key={item.id}
                    name={item.nom_plat}
                    quantity={item.quantite}
                    price={item.prix_total}
                    image={item.image_plat || "/placeholder.svg"}
                  />
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{commande.total.toFixed(2)}f</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Informations de livraison</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium text-foreground">
                      {commande.adresse_livraison}, {commande.commune}, {commande.ville}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium text-foreground">{commande.client.telephone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temps estimé</p>
                    <p className="font-medium text-foreground">30-40 minutes</p>
                  </div>
                </div>

                {/* Montant en espèces (si communiqué) */}
                {(() => {
                  // Priorité: valeur renvoyée par l'API si présente, sinon tentative d'analyse dans les instructions
                  const announced = (commande.paiement && (commande.paiement as any).montant_en_especes) as number | undefined
                  const instrMatch = commande.instructions ? commande.instructions.match(/Montant en espèces annoncé:\s*([0-9.,]+)/) : null
                  const announcedFromInstr = instrMatch ? Number(instrMatch[1].replace(/,/g, '.')) : undefined
                  const montant = announced ?? announcedFromInstr
                  if (!montant) return null

                  return (
                    <div className="flex items-start gap-3 mt-3">
                      <Banknote className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Montant en espèces annoncé</p>
                        <p className="font-medium text-foreground">{montant.toFixed(2)}f</p>
                        <p className="text-sm text-muted-foreground">
                          Monnaie à préparer: {(montant - commande.total).toFixed(2)}f
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Besoin d&apos;aide?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Notre équipe est disponible pour répondre à vos questions
              </p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Service client
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
