"use client"

import type React from "react"
import { Header } from "../header"
import { Footer } from "../footer"
import Image from "next/image"

interface PageLayoutProps {
  children: React.ReactNode
  heroSection?: React.ReactNode
}

export function PageLayout({ children, heroSection }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {heroSection ? (
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <Image src="/delicious-food-bowls-overhead.jpg" alt="Background" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/60 to-black/70" />
            </div>
            {heroSection}
          </section>
        ) : null}
        {children}
      </main>
      <Footer />
    </div>
  )
}
