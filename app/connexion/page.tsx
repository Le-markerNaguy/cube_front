"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle, Clock, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/menu")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await login(phone, password)
    if (result.success) {
      router.push("/menu")
    } else {
      setError(result.error || "Erreur de connexion")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Orange Branding */}
      <div className="lg:w-1/2 bg-primary text-primary-foreground p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <Link href="/">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">CUBE</h1>
          </Link>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">Votre restaurant moderne à portée de main</p>

          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/delicious-pizza-overhead.jpg"
              alt="Plat délicieux"
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <span>Commandez en quelques clics</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <span>Livraison rapide garantie</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6" />
              <span>Qualité premium assurée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Connexion</h2>
          <p className="text-muted-foreground mb-8">Connectez-vous pour accéder à votre compte</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md text-muted-foreground">
                  +243
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="XXX XXX XXX"
                  className="rounded-l-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right">
                <Link href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Vous n&apos;avez pas de compte?{" "}
            <Link href="/inscription" className="text-primary hover:underline font-medium">
              Créer un compte
            </Link>
          </p>

          <div className="mt-8 text-center">
            <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
