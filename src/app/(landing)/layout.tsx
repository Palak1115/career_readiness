'use client'

import { ReactNode } from 'react'
import React from 'react'
import Header from './Header'
import Footer from './Footer'
import PageTransition from '@/components/animations/PageTransition'
import ScrollToTop from '@/components/features/scroll/ScrollToTop'
import ScrollProgress from '@/components/features/scroll/ScrollProgress'

export default function WelcomeLayout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen scroll-smooth relative">
      {/* Header with Logo and Navigation - Contained */}
      <Header />

      {/* Main Content - Full Width with Page Transition */}
      <PageTransition>
        {children}
      </PageTransition>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}
