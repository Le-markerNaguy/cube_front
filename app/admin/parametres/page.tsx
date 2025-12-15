"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, Store, Clock, Truck, CreditCard, Bell } from "lucide-react"

export default function AdminParametres() {
  const [settings, setSettings] = useState({
    restaurantName: "CUBE Restaurant",
    phone: "+243 XXX XXX XXX",
    email: "contact@cube-restaurant.com",
    address: "123 Rue de la Gastronomie, Kinshasa",

    openTime: "11:00",
    closeTime: "22:00",
    deliveryRadius: 10,
    minOrderAmount: 15,
    deliveryFee: 3,
    taxRate: 16,

    enableDelivery: true,
    enablePickup: true,
    enableOnlinePayment: true,
    enableCashPayment: true,

    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
  })

  const handleSave = () => {
    // Save settings logic would go here
    alert("Paramètres enregistrés avec succès!")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-500">Configurez votre restaurant</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-500" />
              Informations du restaurant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du restaurant</Label>
              <Input
                id="name"
                value={settings.restaurantName}
                onChange={(e) => setSettings((prev) => ({ ...prev, restaurantName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hours & Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Horaires et livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime">Heure d'ouverture</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={settings.openTime}
                  onChange={(e) => setSettings((prev) => ({ ...prev, openTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">Heure de fermeture</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={settings.closeTime}
                  onChange={(e) => setSettings((prev) => ({ ...prev, closeTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="radius">Rayon de livraison (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={settings.deliveryRadius}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, deliveryRadius: Number.parseInt(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Commande minimum (f)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, minOrderAmount: Number.parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Frais de livraison (f)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings((prev) => ({ ...prev, deliveryFee: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Taux TVA (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings((prev) => ({ ...prev, taxRate: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Livraison à domicile</p>
                <p className="text-sm text-gray-500">Activer le service de livraison</p>
              </div>
              <Switch
                checked={settings.enableDelivery}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableDelivery: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Retrait en restaurant</p>
                <p className="text-sm text-gray-500">Permettre le retrait sur place</p>
              </div>
              <Switch
                checked={settings.enablePickup}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enablePickup: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Modes de paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Paiement mobile</p>
                <p className="text-sm text-gray-500">Airtel Money, M-Pesa, etc.</p>
              </div>
              <Switch
                checked={settings.enableOnlinePayment}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableOnlinePayment: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Paiement à la livraison</p>
                <p className="text-sm text-gray-500">Espèces à la réception</p>
              </div>
              <Switch
                checked={settings.enableCashPayment}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableCashPayment: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications email</p>
                  <p className="text-sm text-gray-500">Nouvelles commandes par email</p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableEmailNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-gray-500">Alertes par SMS</p>
                </div>
                <Switch
                  checked={settings.enableSmsNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableSmsNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-gray-500">Notifications en temps réel</p>
                </div>
                <Switch
                  checked={settings.enablePushNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enablePushNotifications: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
