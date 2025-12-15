import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  withHeader?: boolean
  withFooter?: boolean
}

export function PageLayout({ children, className = "", withHeader = true, withFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {withHeader && <Header />}
      <main className={`flex-1 ${className}`}>{children}</main>
      {withFooter && <Footer />}
    </div>
  )
}
