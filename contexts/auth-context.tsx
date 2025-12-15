"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, commandesApi, type CommandeResponse } from "@/lib/api"

interface Client {
  id: string
  nom_complet: string
  telephone: string
  email?: string
  date_inscription: Date
}

interface Commande {
  id: string
  statut_commande: string
  date_commande: Date
  total: number
  lignes: Array<{
    id: string
    nom_plat: string
    quantite: number
    prix_total: number
  }>
}

interface AuthContextType {
  isAuthenticated: boolean
  client: Client | null
  isLoading: boolean
  login: (telephone: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<Client>) => Promise<{ success: boolean; error?: string }>
  commandes: Commande[]
  commandeEnCours: Commande | null
  refreshCommandes: () => Promise<void>
}

interface RegisterData {
  nom_complet: string
  telephone: string
  email?: string
  mot_de_passe: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [commandes, setCommandes] = useState<Commande[]>([])

  const transformCommande = (apiCommande: CommandeResponse): Commande => ({
    id: apiCommande.id,
    statut_commande: apiCommande.statut_commande,
    date_commande: new Date(apiCommande.date_commande),
    total: apiCommande.total,
    lignes: apiCommande.lignes.map((l) => ({
      id: l.id,
      nom_plat: l.nom_plat,
      quantite: l.quantite,
      prix_total: l.prix_total,
    })),
  })

  const refreshCommandes = useCallback(async () => {
    if (!isAuthenticated) return

    const response = await commandesApi.getMine()
    if (response.success && response.data) {
      setCommandes(response.data.map(transformCommande))
    }
  }, [isAuthenticated])

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("cube_token")
      if (token) {
        const response = await authApi.getProfile()
        if (response.success && response.data) {
          setClient({
            ...response.data,
            date_inscription: new Date(response.data.date_inscription),
          })
          setIsAuthenticated(true)
          // Charger les commandes
          const commandesResponse = await commandesApi.getMine()
          if (commandesResponse.success && commandesResponse.data) {
            setCommandes(commandesResponse.data.map(transformCommande))
          }
        } else {
          localStorage.removeItem("cube_token")
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = useCallback(async (telephone: string, password: string) => {
    setIsLoading(true)

    const response = await authApi.login({
      telephone,
      mot_de_passe: password,
    })

    if (!response.success) {
      setIsLoading(false)
      return { success: false, error: response.error || "Erreur de connexion" }
    }

    const { token, client: apiClient } = response.data!

    // Sauvegarder le token
    localStorage.setItem("cube_token", token)

    setClient({
      ...apiClient,
      date_inscription: new Date(apiClient.date_inscription),
    })
    setIsAuthenticated(true)

    // Charger les commandes
    const commandesResponse = await commandesApi.getMine()
    if (commandesResponse.success && commandesResponse.data) {
      setCommandes(commandesResponse.data.map(transformCommande))
    }

    setIsLoading(false)
    return { success: true }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)

    const response = await authApi.register({
      nom_complet: data.nom_complet,
      telephone: data.telephone,
      email: data.email,
      mot_de_passe: data.mot_de_passe,
    })

    if (!response.success) {
      setIsLoading(false)
      return { success: false, error: response.error || "Erreur lors de l'inscription" }
    }

    const { token, client: apiClient } = response.data!

    localStorage.setItem("cube_token", token)

    setClient({
      ...apiClient,
      date_inscription: new Date(apiClient.date_inscription),
    })
    setIsAuthenticated(true)
    setCommandes([])

    setIsLoading(false)
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()

    setClient(null)
    setIsAuthenticated(false)
    setCommandes([])
    localStorage.removeItem("cube_token")
    localStorage.removeItem("cube_cart")
  }, [])

  const updateProfile = useCallback(
    async (data: Partial<Client>) => {
      if (!client) {
        return { success: false, error: "Non connecté" }
      }

      const response = await authApi.updateProfile(data)

      if (!response.success) {
        return { success: false, error: response.error || "Erreur de mise à jour" }
      }

      setClient((prev) => (prev ? { ...prev, ...data } : null))
      return { success: true }
    },
    [client],
  )

  const commandeEnCours =
    commandes.find((c) => c.statut_commande !== "livree" && c.statut_commande !== "annulee") || null

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        client,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        commandes,
        commandeEnCours,
        refreshCommandes,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
