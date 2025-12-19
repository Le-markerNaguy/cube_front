"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus } from "lucide-react";
import { adminsApi, type AdminResponse } from "@/lib/api";

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [form, setForm] = useState({ nom: "", email: "", mot_de_passe: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    const res = await adminsApi.getAll()
    setLoading(false)

    if (!res.success) {
      setError(res.error || res.message || "Erreur lors du chargement des administrateurs")
      return
    }

    setAdmins(res.data || [])
  }

  const resetForm = () => {
    setForm({ nom: "", email: "", mot_de_passe: "" })
    setEditingId(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.email || (!form.mot_de_passe && !editingId)) return

    setLoading(true)
    setError(null)

    if (editingId) {
      const res = await adminsApi.update(editingId, {
        nom: form.nom,
        email: form.email,
        mot_de_passe: form.mot_de_passe || undefined,
      })

      setLoading(false)

      if (!res.success) {
        setError(res.error || res.message || "Erreur lors de la mise à jour")
        return
      }

      setAdmins((prev) => prev.map((a) => (a.id === editingId ? { ...a, nom: form.nom, email: form.email } : a)))
      resetForm()
      return
    }

    // Create
    const res = await adminsApi.create({ nom: form.nom, email: form.email, mot_de_passe: form.mot_de_passe })
    setLoading(false)

    if (!res.success) {
      setError(res.error || res.message || "Erreur lors de la création")
      return
    }

    if (res.data) {
      const created = res.data
      setAdmins((prev) => [created, ...prev])
    }

    resetForm()
  }

  const handleEdit = (admin: AdminResponse) => {
    setForm({ nom: admin.nom, email: admin.email ?? "", mot_de_passe: "" })
    setEditingId(admin.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet administrateur ?")) return

    setLoading(true)
    const res = await adminsApi.delete(id)
    setLoading(false)

    if (!res.success) {
      setError(res.error || res.message || "Erreur lors de la suppression")
      return
    }

    setAdmins((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">Créer, modifier et supprimer des comptes administrateurs</p>
        </div>

        {/* Form */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Modifier un admin" : "Créer un admin"}
            </h2>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Nom de l'admin" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              <Input placeholder="Email de l'admin" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Mot de passe de l'admin" type="password" value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={loading}>
                {editingId ? "Mettre à jour" : "Créer"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm} disabled={loading}>
                  Annuler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Liste des admins</h2>

          {loading && admins.length === 0 && <p className="text-muted-foreground text-sm">Chargement...</p>}

          {admins.length === 0 && !loading && (
            <p className="text-muted-foreground text-sm">Aucun administrateur pour le moment</p>
          )}

          <div className="space-y-3">
            {admins.map((admin) => (
              <Card key={admin.id} className="rounded-xl hover:shadow transition">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{admin.nom}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(admin)} disabled={loading}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(admin.id)} disabled={loading}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
