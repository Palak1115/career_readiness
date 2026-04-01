'use client'

import { ThemeProvider } from "next-themes"

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"      // Adds class="dark" or class="light" to <html>
      defaultTheme="light"   // default theme
      enableSystem={true}    // Allow "system" theme
    >
      {children}
    </ThemeProvider>
  )
}
