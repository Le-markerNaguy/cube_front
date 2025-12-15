export function DynamicPricing() {
  const orderItems = [
    { label: "Base : Poulet braisé", price: 12.0 },
    { label: "Accompagnement : Frites", price: 3.5 },
    { label: "Accompagnement : Légumes sautés", price: 3.0 },
    { label: "Supplément : Double viande", price: 5.0 },
  ]

  const total = orderItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <section className="py-12 px-4 bg-orange-50">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-8">Prix dynamique</h2>

        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{item.label}</span>
                <span className="text-gray-900 font-medium">{item.price.toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-orange-500 font-bold text-xl">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6 max-w-lg mx-auto">
          Le prix total s'ajuste automatiquement en fonction des options sélectionnées. Vous pouvez donc créer un plat
          selon votre budget.
        </p>
      </div>
    </section>
  )
}
