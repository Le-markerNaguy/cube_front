"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface PermissionCheckboxesProps {
  permissions: { key: string; description?: string }[]
  value: string[]
  onChange: (perms: string[]) => void
}

export function PermissionCheckboxes({ permissions, value, onChange }: PermissionCheckboxesProps) {
  const toggle = (key: string) => {
    if (value.includes(key)) onChange(value.filter((p) => p !== key))
    else onChange([...value, key])
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {permissions.map((p) => (
        <label key={p.key} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
          <Checkbox checked={value.includes(p.key)} onCheckedChange={() => toggle(p.key)} />
          <div>
            <div className="font-medium text-sm">{p.key}</div>
            {p.description && <div className="text-xs text-muted-foreground">{p.description}</div>}
          </div>
        </label>
      ))}
    </div>
  )
}
