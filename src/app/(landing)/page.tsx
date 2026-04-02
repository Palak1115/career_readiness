'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionImage = motion(Image)

import { useState, useRef, useEffect } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
}

export default function LandingPage() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked or failed:", err)
      })
    }
    // Fallback: Show video after 2 seconds even if onCanPlay hasn't fired
    const timer = setTimeout(() => setVideoLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="overflow-x-hidden font-body text-on-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-12 bg-slate-50/50 pt-32 pb-12">
        <div className="absolute inset-0 z-0 bg-slate-50">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000  pointer-events-none ${videoLoaded ? 'opacity-[0.35]' : 'opacity-0'
              }`}
          >
            <source
              // src='https://assets.mixkit.co/videos/4809/4809-720.mp4'
              src='/heroBg.mov'
              type="video/mp4"
            />
          </video>
          {!videoLoaded && (
            <MotionImage
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover grayscale pointer-events-none"
              alt="Corporate architecture background"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              fill
              priority
            />
          )}
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10"
        >
          <div className="lg:col-span-7">
            <motion.span variants={itemVariants} className="text-primary font-headline font-bold tracking-[0.15em] text-[10px] uppercase mt-7 block">
              THE PERFORMANCE STANDARD FOR ELITE TALENT
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-extrabold text-on-background leading-[1.1] mb-10 tracking-tight">
              What’s Your<br />
              <span className="text-primary">Career Readiness Score?</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-2xl text-slate-500 max-w-3xl mb-14 leading-relaxed font-medium">
              The definitive readiness diagnostic for <span className="text-on-background border-b border-primary/20">early-career professionals, career switchers, and high-potential students.</span>
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center mb-16">
              <Link href="/survey">
                <button className="bg-primary text-white! px-12 py-6 rounded-xl font-headline font-bold text-xs tracking-widest uppercase shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
                  Launch Assessment
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </Link>
              <button className="bg-white text-on-background border border-slate-200 px-12 py-6 rounded-xl font-headline font-bold text-xs tracking-widest uppercase transition-all hover:bg-slate-50">
                Theory of Action
              </button>
            </motion.div>

            {/* <motion.div variants={itemVariants} className="flex flex-wrap gap-12 items-center opacity-40 grayscale">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">TRUSTED BY TALENT FROM:</span>
              <div className="flex gap-8 text-sm font-headline font-black">
                <span>FORTUNE 500</span>
                <span>NACE</span>
                <span>IVY LEAGUE</span>
              </div>
            </motion.div> */}
          </div>

          {/* <motion.div
            variants={itemVariants}
            className="hidden lg:block lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-x-12 translate-y-12"></div>
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Image
                src="/images/hero-momentum.png"
                alt="Professional Momentum Visualization"
                className="w-full h-auto rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                width={800}
                height={600}
              />
              <div className="absolute -bottom-8 -left-8 p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 backdrop-blur-sm bg-white/90">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Growth Index</p>
                  <p className="text-xl font-headline font-extrabold text-on-background leading-none">+12.4%</p>
                </div>
              </div>
            </motion.div>
          </motion.div> */}
        </motion.div>
      </section>

      {/* Why PerformanceCore Section */}
      <section id="why-us" className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <span className="text-primary font-headline font-bold tracking-widest text-[10px] uppercase mb-4 block">WHY PERFORMANCECORE</span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight">Precision Diagnostics.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'The 100-Point Score', desc: 'A unified metric of professional readiness, calibrated against high-performance benchmarks.', icon: 'analytics' },
              { title: 'Scientific Rigor', desc: 'Frameworks based on executive coaching data and behavioral psychology, not generic advice.', icon: 'model_training' },
              { title: 'Surgical Actions', desc: 'Recieve 1-3 high-impact steps to execute this month. No more vague career plans.', icon: 'ads_click' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group border-l border-slate-100 pl-8 transition-all hover:border-primary"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary/5 transition-colors">
                  <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-background mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Architect Section */}
      <section id="architect" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute inset-0 border-2 border-primary translate-x-6 translate-y-6 z-0 rounded-2xl"></div>
              <div className="relative z-10 overflow-hidden rounded-2xl aspect-4/5 shadow-2xl">
                <Image
                  src="/images/architect_tita_gray.png"
                  alt="Tita Gray - The Architect"
                  className="w-full h-full object-cover grayscale brightness-110"
                  width={600}
                  height={750}
                />
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <span className="text-primary font-headline font-bold tracking-widest text-[10px] uppercase mb-6 block">MEET THE ARCHITECT</span>
              <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-on-background mb-8 tracking-tight">Tita Gray</h2>
              <div className="space-y-8 text-lg text-slate-600 leading-relaxed font-medium max-w-2xl">
                <p>
                  With over two decades of high-level corporate strategy and executive coaching experience, Tita Gray has engineered the performance frameworks for Fortune 500 leaders.
                </p>
                <p>
                  Her approach combines the technical rigor of business analytics with the motivational nuance of peak performance psychology. Tita doesn&apos;t just coach—she architects careers that command authority and drive measurable impact.
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-200 pt-12 items-center text-center sm:text-left">
                <div>
                  <p className="text-3xl font-headline font-extrabold text-primary mb-1">20+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Years Exp.</p>
                </div>
                <div>
                  <p className="text-3xl font-headline font-extrabold text-primary mb-1">500+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leaders Coached</p>
                </div>
                <div>
                  <p className="text-3xl font-headline font-extrabold text-primary mb-1">15</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry Awards</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Dimensional Framework */}
      <section id="framework" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <span className="text-primary font-headline font-bold tracking-widest text-[10px] uppercase mb-4 block">THE FRAMEWORK</span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight mb-6">The 5 Pillars of Peak Readiness</h2>
            <p className="text-slate-500 font-medium text-lg">A scientific approach to measuring and maximizing professional velocity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
            {[
              { id: '01', title: 'Clarity', icon: 'lightbulb', desc: 'High-resolution career direction and a precise 3-year vision.' },
              { id: '02', title: 'Ownership', icon: 'assignment_ind', desc: 'Moving from passenger to pilot by taking radical accountability.' },
              { id: '03', title: 'Curiosity', icon: 'explore', desc: 'Relentless exploration of market gaps and emerging skills.' },
              { id: '04', title: 'Confidence', icon: 'verified', desc: 'The psychological resilience to navigate high-stakes roles.' },
              { id: '05', title: 'Visibility', icon: 'hub', desc: 'Strategic amplification of your value within the right professional ecosystems.' },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group bg-slate-50 p-8 lg:p-8 rounded-3xl flex flex-col items-center text-center border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <span className="text-[10px] font-black text-primary/30 mb-8 group-hover:text-primary transition-colors">{pillar.id}</span>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">{pillar.icon}</span>
                </div>
                <h4 className="text-xl font-headline font-bold text-on-background mb-4">{pillar.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none grayscale">
          <Image alt="Strategic Background" src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" fill />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-10 tracking-tight">Establish Your Performance <br />Baseline Today.</h2>
          <p className="text-white/60 text-lg md:text-2xl mb-14 max-w-2xl leading-relaxed font-medium">Under 5 minutes to get your definitive Career Readiness Score and customized execution blueprint.</p>
          <Link href="/survey" className='text-white'>
            <button className="bg-primary text-white px-16 py-8 rounded-xl font-headline font-bold text-xs tracking-widest uppercase shadow-2xl shadow-primary/50 transition-all hover:scale-105 active:scale-95">
              Begin Diagnostic
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}