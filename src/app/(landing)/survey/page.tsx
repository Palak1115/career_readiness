'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

    const currentQuestion = questions[currentIndex]
    const currentDimension = dimensions.find(d => d.id === currentQuestion?.dimension)
    const progress = ((currentIndex) / questions.length) * 100

    const handleStart = () => {
        if (userData.role && userData.goal) {
            setStep('assessment')
        }
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
                        <span className="text-primary font-headline font-bold tracking-[0.2em] text-[10px] uppercase mb-6 block">Step 01 of 02</span>
                        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background mb-12 tracking-tight">Define Your <br /><span className="text-primary">Professional Context.</span></h1>

                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
                            <motion.div variants={itemVariants}>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Current Professional Tier</label>
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
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Primary Objective</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        'Grow in current role',
                                        'Strategic industry pivot',
                                        'Elite Leadership Transition',
                                        'Foundational Start'
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
                                className="w-full bg-primary text-white! py-6 rounded-xl font-headline font-bold text-xs tracking-[0.3em] uppercase shadow-xl transition-all hover:bg-primary/95 disabled:opacity-20 mt-6"
                            >
                                Begin diagnostic
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
                        <div className="mb-20">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <motion.div
                                        key={`label-${currentDimension?.id}`}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 mb-3"
                                    >
                                        <span className="material-symbols-outlined text-primary text-lg">{currentDimension?.icon}</span>
                                        <span className="font-headline font-bold text-[10px] uppercase tracking-[0.3em] text-primary">
                                            {currentDimension?.name} Analysis
                                        </span>
                                    </motion.div>
                                    <h2 className="font-headline font-extrabold text-3xl md:text-5xl text-on-surface tracking-tight">
                                        {currentDimension?.name} Framework
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <span className="font-headline font-bold text-xl text-primary tracking-tighter">{Math.round(progress)}%</span>
                                    <p className="text-[10px] uppercase font-bold text-slate-300 tracking-[0.2em] mt-1">Calibration Data</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-primary"
                                ></motion.div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-white p-6 sm:p-12 md:p-24 rounded-3xl shadow-2xl border border-slate-50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                    <span className="material-symbols-outlined text-[200px]">{currentDimension?.icon}</span>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-start gap-12 mb-16">
                                        <span className="flex-none text-[10px] font-black text-slate-400 mt-3 tracking-widest">Q.{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}</span>
                                        <h3 className="font-headline text-3xl md:text-5xl text-on-surface leading-[1.1] font-extrabold tracking-tight">
                                            {currentQuestion.text}
                                        </h3>
                                    </div>

                                    {/* Scientific Interaction Set */}
                                    {currentQuestion.isBehavioral ? (
                                        <div className="flex flex-wrap gap-8">
                                            <div className="text-white!">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAnswer(5)}
                                                    className="px-14 py-6 bg-primary text-white! font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 transition-all"
                                                >
                                                    Yes, Documented
                                                </motion.button>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswer(1)}
                                                className="px-14 py-6 border border-slate-200 text-slate-400 font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all hover:border-primary hover:text-primary"
                                            >
                                                Not Yet Observed
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 ">
                                            {[
                                                { val: 1, label: 'Strongly Disagree' },
                                                { val: 2, label: 'Disagree' },
                                                { val: 3, label: 'Neutral' },
                                                { val: 4, label: 'Agree' },
                                                { val: 5, label: 'Strongly Agree' },
                                            ].map((opt) => (
                                                <motion.button
                                                    key={opt.val}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAnswer(opt.val)}
                                                    className="group/option flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
                                                >
                                                    <span className="text-4xl font-headline font-bold text-slate-300 group-hover/option:text-primary transition-colors">{opt.val}</span>
                                                    <span className="text-[9px] text-center font-black uppercase tracking-widest text-slate-500 group-hover/option:text-primary/70 leading-none">{opt.label}</span>
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
                                className="flex items-center gap-3 font-headline font-bold text-slate-300 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Previous
                            </button>
                            <div className="text-[9px] font-bold text-slate-100 uppercase tracking-[0.4em]">
                                Secure Professional Transmission
                            </div>
                        </div>

                        <motion.aside
                            key={`insight-${currentDimension?.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-24 border-t border-slate-100 pt-16 flex flex-col md:flex-row items-start gap-12 px-12"
                        >
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-2xl">{currentDimension?.icon}</span>
                            </div>
                            <div className="max-w-2xl">
                                <h4 className="font-headline font-extrabold text-on-background text-lg mb-4 tracking-tight">Theory: {currentDimension?.name}</h4>
                                <p className="text-slate-500 leading-relaxed font-medium text-base">
                                    {currentDimension?.description}
                                </p>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
