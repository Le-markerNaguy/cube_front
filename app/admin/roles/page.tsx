"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { rolesApi, permissionsApi } from "@/lib/api"
import { PermissionCheckboxes } from "@/components/admin/permission-checkboxes"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { AccessDenied } from "@/components/admin/access-denied"

export default function AdminRolesPage() {
  const { role, hasPermission, isLoading } = useAuth()
  const { toast } = useToast()

  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState<any | null>(null)
  const [editingPerms, setEditingPerms] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [rRes, pRes] = await Promise.all([rolesApi.getAll(), permissionsApi.getAll()])
      if (rRes.success && rRes.data) setRoles(rRes.data)
      if (pRes.success && pRes.data) setPermissions(pRes.data)
    }
    load()
  }, [])

  if (isLoading) return null

  // Authorize: only superadmin or permission key
  if (role !== "superadmin" && !hasPermission("admin.roles.manage")) {
    return <AccessDenied />
  }

  const selectRole = (r: any) => {
    setSelectedRole(r)
    setEditingPerms(r.permissions || [])
  }

  const save = async () => {
    if (!selectedRole) return
    setSaving(true)
    const res = await rolesApi.updatePermissions(selectedRole.id, editingPerms)
    setSaving(false)
    if (res.success && res.data) {
      setRoles((prev) => prev.map((x) => (x.id === res.data!.id ? res.data : x)))
      toast({ title: "Mise à jour réussie", description: "Permissions mises à jour" })
    } else {
      toast({ title: "Erreur", description: res.error || "Impossible de sauvegarder" })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestion des rôles</h1>
        <p className="text-muted-foreground">Créer et attribuer des permissions aux rôles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-card p-4 rounded">
            <h3 className="font-semibold mb-2">Rôles</h3>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  className={`w-full text-left p-2 rounded ${selectedRole?.id === r.id ? "bg-primary/5 border border-primary" : "bg-white"}`}
                  onClick={() => selectRole(r)}
                >
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.permissions?.length || 0} permissions</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card p-6 rounded">
            <h3 className="font-semibold mb-4">Permissions</h3>
            {!selectedRole && <p className="text-sm text-muted-foreground">Sélectionnez un rôle pour modifier ses permissions</p>}
            {selectedRole && (
              <>
                <div className="mb-4">
                  <div className="font-medium">{selectedRole.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedRole.id}</div>
                </div>

                <PermissionCheckboxes
                  permissions={permissions.map((p: any) => ({ key: p.key, description: p.description }))}
                  value={editingPerms}
                  onChange={(perms) => setEditingPerms(perms)}
                />

                <div className="flex items-center gap-2 mt-4">
                  <Button onClick={save} disabled={saving}>
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => { setSelectedRole(null); setEditingPerms([]) }}>
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
