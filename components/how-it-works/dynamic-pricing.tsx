/* =============================
DynamicPricing.tsx
============================= */

export function DynamicPricing() {
  const orderItems = [
    { label: "Base : Poulet braisé", price: 3500 },
    { label: "Accompagnement : Frites", price: 500 },
    { label: "Accompagnement : Légumes sautés", price: 2000 },
    { label: "Supplément : Double viande", price: 1500 },
  ];

  const total = orderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="py-14 px-4 bg-orange-50">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-8">
          Prix dynamique
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.label}</span>
              <span className="font-medium">
                {item.price.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-orange-500 font-bold text-xl">
              {total.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Le prix s’ajuste automatiquement selon vos choix.
        </p>
      </div>
    </section>
  );
}
