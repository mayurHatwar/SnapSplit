"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { PhotoCircle } from "@/components/photo-circle"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      {/* Floating Photos Background */}
      <div className="absolute inset-0 pointer-events-none">
        <PhotoCircle src="/group-photo-friends-laughing.jpg" style={{ top: "15%", left: "10%" }} delay={0} />
        <PhotoCircle src="/family-beach-vacation.png" style={{ top: "25%", right: "15%" }} delay={1} />
        <PhotoCircle src="/joyful-wedding-celebration.png" style={{ top: "45%", left: "8%" }} delay={2} />
        <PhotoCircle src="/placeholder-k8alk.png" style={{ top: "60%", right: "12%" }} delay={3} />
        <PhotoCircle src="/hiking-adventure-friends.jpg" style={{ top: "75%", left: "20%" }} delay={4} />
        <PhotoCircle src="/graduation-ceremony.png" style={{ top: "35%", right: "25%" }} delay={5} />
      </div>

      <div className="container relative z-10 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm bg-accent/50">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI-Powered Photo Intelligence
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Smart Photo Sharing
            <span className="block text-primary">Made Simple</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl">
            Upload group photos and let AI automatically detect faces to share the right photos with the right people.
            Perfect for events, trips, and gatherings.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/signup">
                Start Sharing Photos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>Free to start • No credit card required • Privacy focused</p>
          </div>
        </div>
      </div>
    </section>
  )
}
