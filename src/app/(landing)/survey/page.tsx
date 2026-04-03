'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from 'antd'

import { dimensions, questions } from '@/data/assessmentData'

type Step = 'onboarding' | 'assessment'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0, 0, 0.58, 1] as any,
        },
    },
}

export default function SurveyPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('onboarding')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [userData, setUserData] = useState({ role: '', goal: '' })
    const [isNavigating, setIsNavigating] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)

    const currentQuestion = questions[currentIndex]
    const currentDimension = dimensions.find(d => d.id === currentQuestion?.dimension)
    const progress = ((currentIndex) / questions.length) * 100

    const handleStart = () => {
        if (userData.role && userData.goal) {
            setShowInstructions(true)
        }
    }

    const startAssessment = () => {
        setShowInstructions(false)
        setStep('assessment')
    }

    const handleAnswer = (value: number) => {
        if (isNavigating) return
        setIsNavigating(true)

        const newAnswers = { ...answers, [currentQuestion.id]: value }
        setAnswers(newAnswers)

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1)
                setIsNavigating(false)
            } else {
                localStorage.setItem('assessment_results', JSON.stringify({
                    answers: newAnswers,
                    userData,
                    completedAt: new Date().toISOString()
                }))
                router.push('/report')
            }
        }, 400)
    }

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        } else {
            setStep('onboarding')
        }
    }

    return (
        <main className="grow pt-32 pb-24 px-6 md:px-12 flex flex-col items-center min-h-screen bg-white font-body text-on-background overflow-hidden relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1847a4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <AnimatePresence mode="wait">
                {step === 'onboarding' ? (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full max-w-2xl bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-slate-100 relative z-10"
                    >
                        <span className="text-primary font-headline font-bold tracking-widest text-[10px] uppercase mb-6 block">Step 01 of 02</span>
                        <div className="flex items-center justify-between mb-12">
                            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight">Define Your <br /><span className="text-primary">Professional Context.</span></h1>
                            <div className="text-right hidden w-full sm:block">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Estimated Time</span>
                                <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">3–4 minutes</span>
                            </div>
                        </div>

                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
                            <motion.div variants={itemVariants}>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-l-2 border-primary/20 pl-4">Current Professional Tier</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Student', 'Early Career', 'Mid-Level', 'Senior'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setUserData({ ...userData, role })}
                                            className={`p-5 rounded-xl border transition-all font-bold text-xs tracking-wider uppercase ${userData.role === role
                                                ? 'border-primary bg-primary text-white! shadow-lg scale-[1.02]'
                                                : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-slate-50/50'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-l-2 border-primary/20 pl-4">Primary Objective</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        'Grow in current role',
                                        'Career Pivot',
                                        'Leadership Transition',
                                        'Entrepreneurship'
                                    ].map(goal => (
                                        <button
                                            key={goal}
                                            onClick={() => setUserData({ ...userData, goal })}
                                            className={`p-5 text-left rounded-xl border transition-all font-bold text-xs tracking-wider uppercase ${userData.goal === goal
                                                ? 'border-primary bg-primary text-white! shadow-lg scale-[1.02]'
                                                : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-slate-50/50'
                                                }`}
                                        >
                                            {goal}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStart}
                                disabled={!userData.role || !userData.goal}
                                className="w-full bg-primary text-white! py-6 rounded-xl font-headline font-bold text-xs tracking-widest uppercase shadow-xl transition-all hover:bg-primary/95 disabled:opacity-20 mt-6"
                            >
                                Launch Diagnostic Assessment
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="assessment"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-4xl relative z-10"
                    >
                        {/* Scientific Progress Orchestrator */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <motion.div
                                        key={`label-${currentDimension?.id}`}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 mb-3"
                                    >
                                        <span className="material-symbols-outlined text-primary text-lg">{currentDimension?.icon}</span>
                                        <span className="font-headline font-bold text-[10px] uppercase tracking-widest text-primary">
                                            {currentDimension?.name} Analysis
                                        </span>
                                    </motion.div>
                                    <div className="flex flex-col">
                                        <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight leading-none !mb-1 !important">
                                            {currentDimension?.name}
                                        </h2>
                                        <p className="text-slate-500 leading-snug font-medium text-base">
                                            {currentDimension?.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-headline font-bold text-xl text-primary tracking-tighter">{Math.round(progress)}%</span>
                                    <p className="text-[10px] uppercase font-bold text-slate-300 tracking-widest mt-1">Calibration Data</p>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-white p-6 sm:p-12 md:p-12 rounded-3xl shadow-2xl border border-slate-50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                    <span className="material-symbols-outlined text-[200px]">{currentDimension?.icon}</span>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-start gap-10 mb-16">
                                        <span className="flex-none text-[10px] font-black text-slate-400 mt-3 tracking-widest">Q.{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}</span>
                                        <h3 className="font-headline text-3xl md:text-5xl text-on-surface leading-[1.1] font-extrabold tracking-tight">
                                            {currentQuestion.text}
                                        </h3>
                                    </div>

                                    {/* Scientific Interaction Set */}
                                    {currentQuestion.isBehavioral ? (
                                        <div className="flex flex-wrap gap-8">
                                            <div className="text-white! relative group/behavioral">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAnswer(5)}
                                                    className="px-14 py-6 bg-primary text-white! font-headline font-bold rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all"
                                                >
                                                    Yes, Documented
                                                </motion.button>
                                                <p className="absolute -bottom-10 left-0 right-0 text-[8px] text-center text-slate-400 font-medium opacity-0 group-hover/behavioral:opacity-100 transition-opacity pointer-events-none">
                                                    I have clear evidence or record of this professional practice.
                                                </p>
                                            </div>

                                            <div className="relative group/behavioral-not">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAnswer(1)}
                                                    className="px-14 py-6 border border-slate-200 text-slate-400 font-headline font-bold rounded-xl uppercase tracking-widest text-[10px] transition-all hover:border-primary hover:text-primary"
                                                >
                                                    Not Yet Observed
                                                </motion.button>
                                                <p className="absolute -bottom-10 left-0 right-0 text-[8px] text-center text-slate-400 font-medium opacity-0 group-hover/behavioral-not:opacity-100 transition-opacity pointer-events-none">
                                                    I haven&apos;t started this or don&apos;t have tangible examples yet.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                                            {[
                                                { val: 1, label: 'NEVER', detail: 'NOT AT ALL', text: 'text-red-500', labelText: 'text-red-500', border: 'border-red-100', hover: 'hover:border-red-500 hover:bg-red-50', description: 'I have no experience with this or I strongly disagree.' },
                                                { val: 2, label: 'RARELY', detail: 'LIMITED', text: 'text-orange-500', labelText: 'text-orange-500', border: 'border-orange-100', hover: 'hover:border-orange-500 hover:bg-orange-50', description: 'I occasionally do this, but it\'s not a regular part of my work.' },
                                                { val: 3, label: 'SOMETIMES', detail: 'INCONSISTENT', text: 'text-amber-500', labelText: 'text-amber-500', border: 'border-amber-100', hover: 'hover:border-amber-500 hover:bg-amber-50', description: 'I apply this about half the time or I\'m unsure.' },
                                                { val: 4, label: 'OFTEN', detail: 'CONSISTENT', text: 'text-lime-500', labelText: 'text-lime-500', border: 'border-lime-100', hover: 'hover:border-lime-500 hover:bg-lime-50', description: 'This describes me well. I consistently demonstrate this.' },
                                                { val: 5, label: 'ALWAYS', detail: 'CORE STRENGTH', text: 'text-green-600', labelText: 'text-green-600', border: 'border-green-100', hover: 'hover:border-green-600 hover:bg-green-50', description: 'I excel at this and apply it almost every day.' },
                                            ].map((opt) => (
                                                <motion.button
                                                    key={opt.val}
                                                    whileHover={{ scale: 1.01, x: 10 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => handleAnswer(opt.val)}
                                                    className={`w-full group/option p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-6 ${opt.border} ${opt.hover} ${answers[currentQuestion.id] === opt.val ? 'bg-slate-50 border-primary' : 'bg-white'}`}
                                                >
                                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/option:shadow-md transition-all">
                                                        <span className={`text-2xl font-headline font-black transition-colors ${opt.text}`}>{opt.val}</span>
                                                    </div>

                                                    <div className="grow grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className={`text-xs font-black uppercase tracking-widest ${opt.labelText}`}>{opt.label}</span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-60">{opt.detail}</span>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                                {opt.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0 opacity-0 group-hover/option:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-16 flex justify-between items-center px-12">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-3 font-headline font-bold text-slate-300 hover:text-primary transition-colors uppercase tracking-widest text-[10px]"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Previous
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal
                open={showInstructions}
                onCancel={() => setShowInstructions(false)}
                footer={null}
                closable={false}
                centered
                width={1100}
                styles={{
                    mask: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.7)' },
                    body: {
                        padding: 0,
                        overflow: 'hidden',
                        borderRadius: '24px',
                        maxHeight: '90vh'
                    }
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Column: Instructions */}
                    <div className="bg-white p-4 relative flex flex-col overflow-hidden">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32" />

                        <div className="relative z-10 space-y-4 overflow-y-auto flex-1 pr-1">
                            {/* Header Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Diagnostic Prep</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{userData.role || 'Professional'}</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-on-background tracking-tighter leading-[0.9] mb-2">
                                    Ready to Begin, <br />
                                    <span className="text-primary italic font-serif"> {userData.role?.split(' ')[0]}?</span>
                                </h1>
                                <p className="text-slate-500 font-medium text-[13px] max-w-md leading-tight">
                                    We&apos;ve tailored this diagnostic for your goal: <span className="text-on-background font-bold tracking-tight">&ldquo;{userData.goal}&rdquo;</span>.
                                </p>
                            </div>

                            {/* Impact/Benefits Section */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: 'bolt', title: 'AI Insights', desc: 'Real-time' },
                                    { icon: 'query_stats', title: 'Calibration', desc: 'Benchmarked' },
                                    { icon: 'account_tree', title: 'Roadmap', desc: 'Custom Plan' }
                                ].map((benefit, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:border-primary/30 transition-all hover:bg-white hover:shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-primary text-base mb-0.5 group-hover:scale-110 transition-transform">{benefit.icon}</span>
                                        <h3 className="text-[8px] font-black text-on-background uppercase tracking-tight mb-0.5">{benefit.title}</h3>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">{benefit.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Response Architecture: Hyper-Focus Diagnostic Core */}
                            <div className="relative group/focus overflow-hidden rounded-[16px] bg-linear-to-br from-primary/8 via-white to-white border border-primary/20 shadow-[0_10px_40px_rgba(24,71,164,0.12)] transition-all duration-1000 hover:shadow-[0_15px_50px_rgba(24,71,164,0.18)]">
                                <div className="relative z-20">


                                    <div className="overflow-y-auto custom-scrollbar">
                                        <div className="flex flex-col gap-1 relative">
                                            {[
                                                { val: 1, color: 'text-red-500', groupHoverBg: 'group-hover/row:bg-red-500 group-hover/row:border-red-500 group-hover/row:shadow-[0_0_15px_rgba(239,68,68,0.3)]', label: 'NEVER', detail: 'NOT AT ALL', desc: 'I have no experience with this or I strongly disagree.' },
                                                { val: 2, color: 'text-orange-500', groupHoverBg: 'group-hover/row:bg-orange-500 group-hover/row:border-orange-500 group-hover/row:shadow-[0_0_15px_rgba(249,115,22,0.3)]', label: 'RARELY', detail: 'LIMITED', desc: 'I occasionally do this, but it\'s not a regular part of my work.' },
                                                { val: 3, color: 'text-amber-500', groupHoverBg: 'group-hover/row:bg-amber-500 group-hover/row:border-amber-500 group-hover/row:shadow-[0_0_15px_rgba(251,191,36,0.3)]', label: 'SOMETIMES', detail: 'INCONSISTENT', desc: 'I apply this about half the time or I\'m unsure.' },
                                                { val: 4, color: 'text-lime-500', groupHoverBg: 'group-hover/row:bg-lime-500 group-hover/row:border-lime-500 group-hover/row:shadow-[0_0_15px_rgba(132,204,22,0.3)]', label: 'OFTEN', detail: 'CONSISTENT', desc: 'This describes me well. I consistently demonstrate this.' },
                                                { val: 5, color: 'text-green-600', groupHoverBg: 'group-hover/row:bg-green-600 group-hover/row:border-green-600 group-hover/row:shadow-[0_0_15px_rgba(22,163,74,0.3)]', label: 'ALWAYS', detail: 'CORE STRENGTH', desc: 'I excel at this and apply it almost every day.' },
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-center gap-3 p-1.5 rounded-xl transition-all hover:bg-white border border-transparent hover:border-slate-100 group/row cursor-default">
                                                    <div className={`w-7 h-7 rounded-lg flex flex-col items-center justify-center transition-all duration-300 border border-slate-100 bg-white relative z-10 shrink-0 
                                                        ${step.groupHoverBg}`}>
                                                        <span className={`text-[9px] font-black transition-colors duration-300 text-on-background group-hover/row:text-white!`}>{step.val}</span>
                                                    </div>

                                                    <div className="w-28 shrink-0">
                                                        <span className={`text-[12px] font-black uppercase tracking-tight ${step.color} block leading-none`}>
                                                            {step.label}
                                                        </span>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">
                                                            {step.detail}
                                                        </p>
                                                    </div>

                                                    <div className="grow border-l border-slate-100 pl-3">
                                                        <p className="text-[11px] text-slate-500 font-medium leading-snug">
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col gap-3 pt-3 shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={startAssessment}
                                className="w-full bg-primary text-white! py-3 rounded-xl font-headline font-bold text-[10px] tracking-[0.1em] uppercase shadow-lg hover:shadow-xl transition-all hover:bg-primary/95 flex items-center justify-center gap-3 group"
                            >
                                Initialize Diagnostic Analysis
                                <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </motion.button>

                            <button
                                onClick={() => setShowInstructions(false)}
                                className="text-[9px] font-black text-slate-300 uppercase tracking-wider hover:text-primary transition-colors flex items-center justify-center gap-2 py-1"
                            >
                                <span className="material-symbols-outlined text-xs">arrow_back</span>
                                Modify Contextual Data
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Pillars Summary */}
                    <div className="hidden lg:flex flex-col bg-slate-900 border-l border-white/5 relative overflow-hidden p-8">
                        {/* Abstract Background */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-slate-900 to-slate-950" />
                        <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="mb-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-6 bg-primary rounded-full" />
                                    <h2 className="text-white! font-headline font-black text-xl tracking-tight">The 5 Core <br />Pillars</h2>
                                </div>
                                <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-xs mb-6 uppercase tracking-widest">
                                    Assess your professional readiness:
                                </p>

                                <div className="space-y-3">
                                    {dimensions.map((dim, i) => (
                                        <motion.div
                                            key={dim.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (i * 0.1) }}
                                            className="flex items-center gap-3 group cursor-default"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <span className="material-symbols-outlined text-white! text-base">{dim.icon}</span>
                                            </div>
                                            <div className="flex-1 border-b border-white/5 pb-2 group-hover:border-white/10 transition-all">
                                                <h4 className="text-white! font-bold text-[11px] uppercase tracking-widest group-hover:text-primary transition-colors">{dim.name}</h4>
                                                <p className="text-slate-500 text-[11px] font-medium leading-tight group-hover:text-slate-400 transition-colors">{dim.description.split(' (')[0]}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Calibration Active</span>
                                </div>
                                <p className="text-white/80 text-[10px] font-medium italic leading-snug">
                                    &ldquo;Your transition from {userData.role?.split(' ')[0] || 'Current Level'} to your next peak starts here.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </main >
    )
}
