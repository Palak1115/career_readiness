'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts'
import { dimensions, questions, archetypes } from '@/data/assessmentData'

interface AssessmentResults {
    answers: Record<string, number>;
    userData: { role: string; goal: string };
    completedAt: string;
}

function CountUp({ value }: { value: number }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, Math.round)

    useEffect(() => {
        const animation = animate(count, value, { duration: 2, ease: 'easeOut' })
        return animation.stop
    }, [value, count])

    return <motion.span>{rounded}</motion.span>
}

export default function ReportPage() {
    const [results, setResults] = useState<AssessmentResults | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedResults = localStorage.getItem('assessment_results')
        if (savedResults) {
            setResults(JSON.parse(savedResults))
        }
        setLoading(false)
    }, [])

    const scores = useMemo(() => {
        if (!results) return null

        const dimScores: Record<string, number> = {}
        dimensions.forEach(dim => {
            const dimQuestions = questions.filter(q => q.dimension === dim.id)
            const totalScore = dimQuestions.reduce((sum, q) => sum + (results.answers[q.id] || 0), 0)
            const maxPossible = dimQuestions.length * 5
            dimScores[dim.id] = Math.round((totalScore / maxPossible) * 100)
        })

        const overallScore = Math.round(
            Object.values(dimScores).reduce((sum, val) => sum + val, 0) / dimensions.length
        )

        return { dimScores, overallScore }
    }, [results])

    const archetype = useMemo(() => {
        if (!scores) return null
        return archetypes.find(a => scores.overallScore >= a.range[0] && scores.overallScore <= a.range[1]) || archetypes[archetypes.length - 1]
    }, [scores])

    const chartData = useMemo(() => {
        if (!scores) return []
        return dimensions.map(dim => ({
            subject: dim.name,
            A: scores.dimScores[dim.id],
            fullMark: 100,
        }))
    }, [scores])

    const lowestDimension = useMemo(() => {
        if (!scores) return null
        const minVal = Math.min(...Object.values(scores.dimScores))
        const dimKey = Object.keys(scores.dimScores).find(key => scores.dimScores[key] === minVal)
        return dimensions.find(d => d.id === dimKey)
    }, [scores])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="h-8 w-8 border-t-2 border-primary rounded-full"
            ></motion.div>
        </div>
    )

    if (!results || !scores) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
            <h1 className="text-xl font-headline font-bold text-slate-400 uppercase tracking-widest">No Diagnostic Found</h1>
            <Link href="/survey">
                <button className="bg-primary text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px]">Initialize Assessment</button>
            </Link>
        </div>
    )

    return (
        <main className="pt-32 pb-24 bg-white min-h-screen font-body text-on-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Professional Header */}
                <header className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-8"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <span className="bg-slate-900 text-white px-4 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase rounded-lg">CALIBRATED DATA</span>
                            <div className="h-px grow bg-slate-100"></div>
                        </div>
                        <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-12">
                            {archetype?.label} <br />
                            <span className="text-primary opacity-20 text-2xl sm:text-4xl md:text-6xl font-bold tracking-widest blur-[0.5px]">REDACTED READY</span>
                        </h1>
                        <p className="text-slate-500 text-xl md:text-2xl max-w-3xl leading-relaxed font-medium">
                            {archetype?.description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="lg:col-span-4 flex flex-col items-center lg:items-end"
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white border border-slate-100 shadow-xl rounded-full">
                            <div className="text-center relative z-10">
                                <span className="font-headline text-7xl md:text-8xl font-extrabold text-primary tracking-tighter block">
                                    <CountUp value={scores.overallScore} />
                                </span>
                                <span className="block text-[9px] font-black text-slate-300 tracking-[0.4em] uppercase mt-2">Readiness Baseline</span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Diagnostic Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 bg-slate-50/50 p-6 sm:p-12 md:p-20 rounded-3xl border border-slate-100"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">Dimensional Architecture</h2>
                            <span className="text-[10px] font-black tracking-widest text-primary/40 uppercase">Scientific Profile</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800, textAnchor: 'middle' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Readiness"
                                            dataKey="A"
                                            stroke="#1847a4"
                                            fill="#1847a4"
                                            fillOpacity={0.3}
                                            animationDuration={1500}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-10">
                                {dimensions.map((dim) => (
                                    <div key={dim.id}>
                                        <div className="flex justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-headline font-black text-[9px] uppercase tracking-widest text-slate-400">{dim.name}</span>
                                            </div>
                                            <span className="text-primary font-extrabold text-xs tabular-nums">{scores.dimScores[dim.id]}</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 w-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${scores.dimScores[dim.id]}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="bg-primary h-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Context Vault */}
                    <motion.section
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 p-12 rounded-3xl text-white flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="font-headline text-2xl font-extrabold tracking-tight mb-12">User Context</h2>
                            <div className="space-y-12">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Baseline Tier</p>
                                    <p className="text-3xl font-extrabold tracking-tight">{results.userData.role}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Strategic North Star</p>
                                    <p className="text-lg font-medium leading-relaxed text-white/80">{results.userData.goal}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-12 border-t border-white/5 opacity-30 text-[9px] font-bold tracking-widest uppercase">
                            Authenticated v1.4
                        </div>
                    </motion.section>
                </div>

                {/* Priority Execution Blueprint */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-20 border border-slate-100 rounded-3xl"
                    >
                        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-12">Execution Blueprint</h2>
                        <div className="space-y-12">
                            <div className="flex gap-8 items-start pb-12 border-b border-slate-50">
                                <div className="w-10 h-10 border border-primary text-primary rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-xl">{lowestDimension?.icon}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] block mb-3">Critical Constraint</span>
                                    <h3 className="font-headline text-2xl font-extrabold text-slate-800 mb-4 tracking-tight">The {lowestDimension?.name} Optimizer</h3>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                        Your {lowestDimension?.name} trajectory is currently your primary bottleneck. Initiate high-velocity focus here.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-8 items-start">
                                <div className="w-10 h-10 border border-slate-200 text-slate-300 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-xl">bolt</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Momentum Lever</span>
                                    <h3 className="font-headline text-2xl font-extrabold text-slate-700 mb-4 tracking-tight">Skill Compounding</h3>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                        Leverage your core curiosity strength to initiate a &apos;Career Sprint&apos; this month.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-primary p-8 sm:p-12 md:p-24 rounded-3xl flex flex-col items-center text-center text-white relative overflow-hidden"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-extrabold mb-10 tracking-tight">Broadcast Momentum.</h2>
                        <p className="text-white/60 text-lg md:text-xl mb-12 max-w-sm leading-relaxed font-medium">
                            Validate your readiness and inspire your professional network.
                        </p>
                        <button
                            onClick={() => {
                                const text = `I just received my PerformanceCore Readiness Score: ${scores.overallScore}/100! Apparently, my profile matches the "${archetype?.label}" archetype. Check your own readiness here:`
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`, '_blank')
                            }}
                            className="border-2 border-white text-white! px-12 py-6 rounded-xl font-headline font-bold text-xs tracking-[0.4em] uppercase transition-all shadow-xl w-full hover:bg-white hover:text-primary! active:scale-[0.98] print:hidden"
                        >
                            Share Result
                        </button>
                        <div className="mt-12 flex gap-8 whitespace-nowrap">
                            <button
                                onClick={() => window.print()}
                                className="text-white/40 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[10px]">download</span>
                                Download PDF
                            </button>
                            <button className="text-white/40 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.3em]">Vertical Assets</button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
