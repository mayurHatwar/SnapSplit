import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Share2, Shield, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Face Detection",
      description: "Automatically detect and group photos by faces using advanced AI technology",
    },
    {
      icon: Share2,
      title: "Smart Sharing",
      description: "Share albums with friends and family with customizable privacy settings",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your photos are safely stored with enterprise-grade security and privacy",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload, organize, and share your photos in seconds with our optimized platform",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features for Photo Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SnapSplit combines cutting-edge AI with intuitive design to revolutionize how you organize and share your
            memories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
