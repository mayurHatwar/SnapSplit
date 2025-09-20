import { Upload, Brain, Users, Share } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      step: "1",
      title: "Upload Photos",
      description: "Simply drag and drop your photos or select them from your device",
    },
    {
      icon: Brain,
      step: "2",
      title: "AI Analysis",
      description: "Our AI automatically detects faces and analyzes your photos for smart organization",
    },
    {
      icon: Users,
      step: "3",
      title: "Smart Grouping",
      description: "Photos are automatically sorted by people, events, and other intelligent criteria",
    },
    {
      icon: Share,
      step: "4",
      title: "Share & Enjoy",
      description: "Share albums with friends and family or keep them private for yourself",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How SnapSplit Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
