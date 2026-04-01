import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="w-full py-20 px-6 md:px-12 bg-[#0a0c10] text-slate-400 font-body text-sm">
            <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-left">
                <div className="space-y-8 md:w-1/3">
                    <div className="flex items-center gap-3">
                        <img
                            alt="PerformanceCore"
                            className="h-10 w-auto object-contain"
                            src="/logo.png"
                        />
                        <div className="text-xl font-bold text-white uppercase tracking-tighter font-headline">PerformanceCore</div>
                    </div>
                    <p className="max-w-xs text-slate-500 leading-relaxed">
                        Engineered for the ambitious. The definitive metric for early-career readiness.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-16 md:w-1/3">
                    <div className="flex flex-col space-y-4">
                        <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Support</Link>
                        <Link href="/framework" className="hover:text-white transition-colors duration-200">Career Framework</Link>
                    </div>
                </div>

                <div className="flex flex-col justify-between items-end md:w-1/3 h-full gap-8">
                    <div className="flex space-x-8">
                        <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">share</span>
                        <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">mail</span>
                        <span className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">analytics</span>
                    </div>
                    <div className="text-slate-600 text-right">
                        <div>© {new Date().getFullYear()} PerformanceCore. Precision Engineering for Professionals.</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
