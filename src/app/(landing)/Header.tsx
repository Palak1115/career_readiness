'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Why Us', href: '#why-us' },
        { name: 'Framework', href: '#framework' },
        { name: 'The Architect', href: '#architect' },
    ]

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 font-body ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
            <nav className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 z-50">
                    <img
                        alt="PerformanceCore Logo"
                        className="h-8 md:h-11 w-auto object-contain"
                        src="/logo.png"
                    />
                    <div className="text-sm md:text-xl font-headline font-extrabold tracking-[0.05em] text-on-background uppercase">
                        PERFORMANCECORE
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-8 xl:space-x-12 font-headline font-bold">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-slate-500 hover:text-primary transition-all duration-300 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/survey" className='hidden md:block text-white!'>
                        <button className="bg-primary hover:bg-primary/90 text-white! px-5 lg:px-8 py-2 md:py-3 rounded-xl font-headline font-bold text-[9px] md:text-[10px] tracking-[0.2em] lg:tracking-[0.3em] uppercase transition-all duration-300 shadow-lg shadow-primary/20 whitespace-nowrap">
                            Launch readiness
                        </button>
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
                    >
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-primary rounded-full block"
                        ></motion.span>
                        <motion.span
                            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-6 h-0.5 bg-primary rounded-full block"
                        ></motion.span>
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-primary rounded-full block"
                        ></motion.span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-headline font-bold text-on-background uppercase tracking-[0.2em]"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link href="/survey" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="bg-primary text-white! px-10 py-5 rounded-xl font-headline font-bold text-xs tracking-[0.3em] uppercase shadow-xl mt-8">
                                Launch Readiness
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
