import Image from "next/image"

interface OrderItemDisplayProps {
  name: string
  description?: string
  quantity: number
  price: number
  image: string
}

export function OrderItemDisplay({ name, description, quantity, price, image }: OrderItemDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <Image src={image || "/placeholder.svg"} alt={name} width={60} height={60} className="rounded-lg object-cover" />
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{name}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <p className="text-sm text-muted-foreground">Quantité: {quantity}</p>
      </div>
      <span className="font-semibold text-primary">{price.toFixed(2)}f</span>
    </div>
  )
}
