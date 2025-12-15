"use client"

import { useEffect, useState } from "react"
import { Search, ChevronLeft, ChevronRight, Eye, Mail, Phone, MapPin, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientsApi, type ClientResponse } from "@/lib/api"

export default function AdminClients() {
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null)
  const clientsPerPage = 10

  useEffect(() => {
    let mounted = true
    async function loadClients() {
      try {
        const res = await clientsApi.getAll()
        if (mounted && res.success) {
          setClients(res.data || [])
        }
      } catch (e) {
        console.error("Failed to load clients:", e)
      }
    }
    loadClients()
    return () => {
      mounted = false
    }
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.telephone.includes(searchQuery) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const paginatedClients = filteredClients.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestion des clients</h1>
        <p className="text-gray-500">Consultez et gérez vos clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <p className="text-gray-500 text-sm">Total clients</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <p className="text-gray-500 text-sm">Nouveaux ce mois</p>
            <p className="text-3xl font-bold text-green-600">-</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <p className="text-gray-500 text-sm">Clients actifs</p>
            <p className="text-3xl font-bold text-orange-500">-</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <p className="text-gray-500 text-sm">Panier moyen</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, téléphone ou email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Button variant="outline">Exporter</Button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b bg-gray-50">
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium hidden md:table-cell">Contact</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Adresse</th>
                  <th className="p-4 font-medium">Commandes</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Total dépensé</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client: ClientResponse) => (
                  <tr key={client.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-medium">
                            {client.nom_complet
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.nom_complet}</p>
                          <p className="text-gray-500 text-sm">
                            Depuis{" "}
                            {new Date(client.date_inscription).toLocaleDateString("fr-FR", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-gray-900">{client.telephone}</p>
                      <p className="text-gray-500 text-sm">{client.email}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-gray-600">-</td>
                    <td className="p-4 font-medium text-gray-900">{client.nombre_commandes}</td>
                    <td className="p-4 font-semibold text-orange-500 hidden sm:table-cell">
                      {Number(client.total_depense).toFixed(2)} f
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <p className="text-gray-500 text-sm">
              Affichage {(currentPage - 1) * clientsPerPage + 1}-
              {Math.min(currentPage * clientsPerPage, filteredClients.length)} sur {filteredClients.length} clients
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 bg-transparent"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`w-8 h-8 ${currentPage === page ? "bg-orange-500 text-white" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 bg-transparent"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Détails du client</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedClient(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xl">
                    {selectedClient.nom_complet
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedClient.nom_complet}</h3>
                  <p className="text-gray-500">
                    Client depuis {new Date(selectedClient.date_inscription).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>{selectedClient.telephone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span>{selectedClient.email}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p>-</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm">Commandes</p>
                  <p className="text-2xl font-bold">{selectedClient.nombre_commandes}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm">Total dépensé</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {Number(selectedClient.total_depense).toFixed(2)} f
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setSelectedClient(null)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
