"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Package, Eye, Clock, CheckCircle, Truck, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { StatutCommande } from "@/lib/types"
import { commandesApi, type CommandeResponse } from "@/lib/api"

const statutConfig: Record<StatutCommande, { label: string; color: string; icon: typeof Package }> = {
  en_attente: { label: "Nouveau", color: "bg-blue-100 text-blue-700", icon: Clock },
  en_preparation: { label: "En préparation", color: "bg-yellow-100 text-yellow-700", icon: Package },
  confirmee: { label: "Confirmée", color: "bg-teal-100 text-teal-700", icon: CheckCircle },
  en_livraison: { label: "En livraison", color: "bg-purple-100 text-purple-700", icon: Truck },
  livree: { label: "Livrée", color: "bg-green-100 text-green-700", icon: CheckCircle },
  annulee: { label: "Annulée", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function MesCommandesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [commandesList, setCommandesList] = useState<CommandeResponse[]>([])
  const [loadingCommandes, setLoadingCommandes] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/connexion")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!isAuthenticated) return
      setLoadingCommandes(true)
      setFetchError(null)

      const res = await commandesApi.getMine()
      if (!mounted) return
      setLoadingCommandes(false)

      if (!res.success) {
        setFetchError(res.error || res.message || "Erreur lors du chargement des commandes")
        setCommandesList([])
        return
      }

      setCommandesList(res.data || [])
    }

    load()
    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  if (isLoading) {
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
          <p className="text-muted-foreground mb-8">Historique de toutes vos commandes</p>

          {loadingCommandes && (
            <Card className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
              <p className="text-muted-foreground">Chargement de vos commandes...</p>
            </Card>
          )}

          {fetchError && (
            <Card className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Erreur</h2>
              <p className="text-muted-foreground mb-4">{fetchError}</p>
              <Button onClick={() => window.location.reload()}>Réessayer</Button>
            </Card>
          )}

          {commandesList.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
              <p className="text-muted-foreground mb-6">Vous n&apos;avez pas encore passé de commande</p>
              <Link href="/menu">
                <Button className="bg-primary text-primary-foreground">Découvrir le menu</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {commandesList.map((commande) => {
                const config = statutConfig[commande.statut_commande]
                const Icon = config.icon

                return (
                  <Card key={commande.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg">Commande #{commande.id}</h3>
                              <Badge className={config.color}>{config.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(commande.date_commande).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-sm mt-2">
                              {commande.lignes.map((l) => `${l.quantite}x ${l.nom_plat}`).join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{commande.total.toFixed(2)}f</p>
                            <p className="text-sm text-muted-foreground">{commande.lignes.length} article(s)</p>
                          </div>
                          <Link href={`/suivi?id=${commande.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {commande.statut_commande === "livree" &&
                        commande.date_livree &&
                        commande.date_depart_livraison && (
                          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Durée de livraison:{" "}
                            {Math.round(
                              (new Date(commande.date_livree).getTime() -
                                new Date(commande.date_depart_livraison).getTime()) /
                                60000,
                            )}{" "}
                            minutes
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
