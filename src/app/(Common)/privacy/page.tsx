"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Privacy = () => {
  const sections = [
    {
      title: "1. Information Collection",
      content: "We collect information that you provide directly to us when you perform a career readiness assessment, create an account, or communicate with us. This may include your professional role, career goals, and assessment responses."
    },
    {
      title: "2. Use of Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect PerformanceCore and our users. Your diagnostic data is used to generate personalized career insights."
    },
    {
      title: "3. Data Security",
      content: "We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Our infrastructure is engineered for professional-grade security."
    },
    {
      title: "4. Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You can manage your profile settings or contact supported for assistance with data portability and privacy-related inquiries."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white! text-xl">shield</span>
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Legal Framework</span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-background tracking-tighter leading-tight mb-4">
            Privacy <span className="text-primary italic font-serif">Policy</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Your trust is our most valuable asset. We are committed to protecting your professional data with scientific precision and absolute transparency.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm"
        >
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <h2 className="text-lg font-headline font-bold text-on-background mb-4 flex items-center gap-3 group-hover:text-primary transition-colors">
                  <span className="text-primary/20 font-serif italic text-2xl leading-none">#</span>
                  {section.title}
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium pl-8 border-l border-slate-100 italic font-serif">
                  &ldquo;{section.content}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Last Updated: April 2026
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PerformanceCore Compliance</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy