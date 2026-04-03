'use client'

import { ReactNode } from 'react'
import React from 'react'

export default function CommonLayout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen">
      {/* <div className="bg-card p-1 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <AppLogo />
          <ThemeSwitcher />
        </div>
      </div> */}
      {/* Optional: Admin header/nav */}
      {children}
    </div>
  )
}
