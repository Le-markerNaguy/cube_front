"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminsApi, rolesApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { AccessDenied } from "@/components/admin/access-denied"

export default function AdminsPage() {
  const { role, hasPermission, isLoading } = useAuth()
  const { toast } = useToast()

  const [admins, setAdmins] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ nom: "", email: "", mot_de_passe: "", role_id: "" })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [aRes, rRes] = await Promise.all([adminsApi.getAll(), rolesApi.getAll()])
      if (aRes.success && aRes.data) setAdmins(aRes.data)
      if (rRes.success && rRes.data) setRoles(rRes.data)
      setLoading(false)
    }
    load()
  }, [])

  if (isLoading) return null
  if (role !== "superadmin" && !hasPermission("admin.admins.manage")) return <AccessDenied />

  const createAdmin = async () => {
    const res = await adminsApi.create({ nom: form.nom, email: form.email, mot_de_passe: form.mot_de_passe, role_id: form.role_id })
    if (res.success && res.data) {
      setAdmins((prev) => [res.data!, ...prev])
      setShowCreate(false)
      toast({ title: "Admin créé" })
      setForm({ nom: "", email: "", mot_de_passe: "", role_id: "" })
    } else {
      toast({ title: "Erreur", description: res.error || "Impossible de créer l'admin" })
    }
  }

  const removeAdmin = async (id: string) => {
    if (!confirm("Supprimer cet administrateur ?")) return
    const res = await adminsApi.delete(id)
    if (res.success) {
      setAdmins((prev) => prev.filter((a) => a.id !== id))
      toast({ title: "Supprimé" })
    } else {
      toast({ title: "Erreur", description: res.error })
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des administrateurs</h1>
          <p className="text-muted-foreground">Créer, modifier ou supprimer des administrateurs et leur rôle</p>
        </div>
        <div>
          <Button onClick={() => setShowCreate(true)}>Nouvel administrateur</Button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 bg-card p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Mot de passe" type="password" value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} />
            <select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} className="p-2 rounded border mt-2">
              <option value="">Aucun rôle</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button onClick={createAdmin}>Créer</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
          </div>
        </div>
      )}

      <div className="bg-card p-4 rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {admins.map((a) => (
            <div key={a.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{a.nom}</div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
                <div className="text-xs text-muted-foreground">{a.role?.name || a.role || "Aucun rôle"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(a.email)}>Copier</Button>
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => removeAdmin(a.id)}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
