"use client"

import React from "react"
import { Lock } from "lucide-react"

export function AccessDenied({ message = "Accès refusé. Vous n'avez pas les permissions nécessaires." }: { message?: string }) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Accès refusé</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
