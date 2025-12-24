"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, commandesApi, type CommandeResponse, type LoginResponse } from "@/lib/api"
import type { Client as ApiClient } from "@/lib/types"

type PublicClient = Omit<ApiClient, "mot_de_passe" | "date_inscription"> & { date_inscription: Date }

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
  client: PublicClient | null
  role?: string
  permissions?: string[]
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<PublicClient>) => Promise<{ success: boolean; error?: string }>
  commandes: Commande[]
  commandeEnCours: Commande | null
  refreshCommandes: () => Promise<void>
  hasPermission: (permission: string) => boolean
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
  const [client, setClient] = useState<PublicClient | null>(null)
  const [role, setRole] = useState<string | undefined>(undefined)
  const [permissions, setPermissions] = useState<string[] | undefined>(undefined)
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
          const profile = response.data
          setClient({
            ...profile,
            date_inscription: new Date(profile.date_inscription),
          })
          setRole((profile as any).role)
          setPermissions((profile as any).permissions)
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

  const login = useCallback(async (identifier: string, password: string) => {
    setIsLoading(true)

    // Détecter si l'identifiant est un email
    const isEmail = identifier.includes("@")

    const response = await authApi.login({
      ...(isEmail ? { email: identifier } : { telephone: identifier }),
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
    // RBAC
    if ((apiClient as any).role) setRole((apiClient as any).role)
    if ((apiClient as any).permissions) setPermissions((apiClient as any).permissions)

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
    setRole(undefined)
    setPermissions(undefined)
    setIsAuthenticated(false)
    setCommandes([])
    localStorage.removeItem("cube_token")
    localStorage.removeItem("cube_cart")
  }, [])

  const updateProfile = useCallback(
    async (data: Partial<PublicClient>) => {
      if (!client) {
        return { success: false, error: "Non connecté" }
      }

      const { date_inscription, ...rest } = data
      const payload: Partial<LoginResponse["client"]> = {
        ...rest,
        ...(date_inscription instanceof Date
          ? { date_inscription: date_inscription.toISOString() }
          : {}),
      }

      const response = await authApi.updateProfile(payload)

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

  const hasPermission = (permission: string) => {
    if (!permissions) return false
    if (permissions.includes("*")) return true
    if (role === "superadmin") return true
    return permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        client,
        role,
        permissions,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        commandes,
        commandeEnCours,
        refreshCommandes,
        hasPermission,
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
