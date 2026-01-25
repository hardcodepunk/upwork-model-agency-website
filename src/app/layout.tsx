// Next
import { Metadata } from "next"

// React
import { ReactNode } from "react"

// Theme
import ThemeRegistry from "@/components/ThemeRegistry"

// Fonts
import { Inter } from "next/font/google"

// Vercel
import { SpeedInsights } from "@vercel/speed-insights/next"

// Global Styles
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Valhalla Girls",
  description: "Become a Valhalla Girl and enter today.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    title: "Valhalla Girls",
    statusBarStyle: "default",
    capable: true,
  },
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "500", "700", "800"],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        <SpeedInsights />
      </body>
    </html>
  )
}
