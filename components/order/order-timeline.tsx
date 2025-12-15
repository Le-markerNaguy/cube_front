interface TimelineStep {
  id: number
  title: string
  time: string
  description: string
  completed: boolean
  active: boolean
}

interface OrderTimelineProps {
  steps: TimelineStep[]
  currentStatus?: string
}

export function OrderTimeline({ steps, currentStatus }: OrderTimelineProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-foreground">État de la commande</h2>
        {currentStatus && (
          <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">{currentStatus}</span>
        )}
      </div>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  step.completed ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"
                }`}
              />
              {index < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-2 ${step.completed ? "bg-primary" : "bg-muted-foreground/30"}`} />
              )}
            </div>

            <div className="flex-1 -mt-1">
              <h3 className={`font-semibold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.time}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
