"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Terms = () => {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using PerformanceCore, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services."
    },
    {
      title: "2. User Responsibilities",
      content: "You are responsible for your use of the services and for any content you provide. You must provide accurate and complete information when creating an account or performing assessments."
    },
    {
      title: "3. Intellectual Property",
      content: "The services and their original content, features, and functionality are and will remain the exclusive property of PerformanceCore and its licensors."
    },
    {
      title: "4. Limitation of Liability",
      content: "In no event shall PerformanceCore be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits or data."
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
              <span className="material-symbols-outlined text-white! text-xl">gavel</span>
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Service Agreement</span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-background tracking-tighter leading-tight mb-4">
            Terms of <span className="text-primary italic font-serif">Service</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Defining the standards for professional engagement. Our terms ensure a fair, secure, and world-class environment for all ambitious individuals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm"
        >
          <div className="space-y-12">
            {terms.map((term, idx) => (
              <div key={idx} className="group">
                <h2 className="text-lg font-headline font-bold text-on-background mb-4 flex items-center gap-3 group-hover:text-primary transition-colors">
                  <span className="text-primary/20 font-serif italic text-2xl leading-none">§</span>
                  {term.title}
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium pl-8 border-l border-slate-100">
                  {term.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Effective Date: April 1, 2026
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PerformanceCore Global Ethics</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms