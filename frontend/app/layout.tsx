import React from "react"
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans antialiased">
      {children}
    </div>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
