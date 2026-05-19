import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import "./globals.css"
import { DevNavBar } from "@/components/dev-nav-bar"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sanctuary Health | Telemedicina Premium",
  description:
    "Viví un santuario para tu salud. Telemedicina segura y centrada en las personas que prioriza tu tranquilidad.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface font-body antialiased">
        <DevNavBar />
        {children}
      </body>
    </html>
  )
}
