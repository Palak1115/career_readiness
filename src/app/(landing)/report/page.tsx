'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts'
import { dimensions, questions, archetypes, dimensionInsights } from '@/data/assessmentData'
import { toPng } from 'html-to-image'

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

const bandConfig: Record<'low' | 'medium' | 'high', { label: string; color: string; bg: string }> = {
    low: { label: 'Low Readiness', color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
    medium: { label: 'Medium Readiness', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    high: { label: 'High Readiness', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
}

function getBand(score: number): 'low' | 'medium' | 'high' {
    if (score >= 75) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
}

export default function ReportPage() {
    const [results, setResults] = useState<AssessmentResults | null>(null)
    const [loading, setLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [isExportingVertical, setIsExportingVertical] = useState(false)
    const [copied, setCopied] = useState(false)
    const reportRef = useRef<HTMLDivElement>(null)
    const verticalReportRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const savedResults = localStorage.getItem('assessment_results')
        if (savedResults) {
            setResults(JSON.parse(savedResults))
        }
        setLoading(false)
    }, [])

    const handleDownloadImage = async (isVertical = false) => {
        const targetRef = isVertical ? verticalReportRef : reportRef
        if (targetRef.current === null) return

        if (isVertical) setIsExportingVertical(true)
        else setIsExporting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 800))

            const dataUrl = await toPng(targetRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 3,
                skipFonts: true,
            })

            const link = document.createElement('a')
            const date = new Date().toISOString().split('T')[0]
            const suffix = isVertical ? 'Story' : 'Report'
            link.download = `Career-Readiness-${suffix}-${date}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Error generating image:', err)
        } finally {
            if (isVertical) setIsExportingVertical(false)
            else setIsExporting(false)
        }
    }

    const scores = useMemo(() => {
        if (!results) return null

        const dimScores: Record<string, number> = {}
        dimensions.forEach(dim => {
            const dimQuestions = questions.filter(q => q.dimension === dim.id)
            const totalScore = dimQuestions.reduce((sum, q) => sum + (results.answers[q.id] || 0), 0)
            const maxPossible = dimQuestions.length * 5
            dimScores[dim.id] = Math.round((totalScore / maxPossible) * 100)
        })

        // Weighted Scoring — Clarity and Ownership weighted 1.2x
        const weights: Record<string, number> = {
            clarity: 1.2,
            ownership: 1.2,
            curiosity: 1.0,
            confidence: 1.0,
            network: 1.0
        }

        let totalWeightedScore = 0
        let totalWeight = 0

        Object.keys(dimScores).forEach(dimId => {
            const weight = weights[dimId] || 1.0
            totalWeightedScore += dimScores[dimId] * weight
            totalWeight += weight
        })

        const overallScore = Math.round(totalWeightedScore / totalWeight)

        return { dimScores, overallScore }
    }, [results])

    const dimensionCategories = useMemo(() => {
        if (!scores) return null
        const categories: Record<string, 'low' | 'solid' | 'strong'> = {}
        Object.entries(scores.dimScores).forEach(([dimId, score]) => {
            if (score < 50) categories[dimId] = 'low'
            else if (score < 75) categories[dimId] = 'solid'
            else categories[dimId] = 'strong'
        })
        return categories
    }, [scores])

    const archetype = useMemo(() => {
        if (!scores) return null
        return archetypes.find(a => scores.overallScore >= a.range[0] && scores.overallScore <= a.range[1]) || archetypes[archetypes.length - 1]
    }, [scores])

    // Career Profile Summary (3-5 words)
    const profileSummary = useMemo(() => {
        if (!dimensionCategories || !scores) return ""
        const strongest = Object.entries(scores.dimScores).sort((a, b) => b[1] - a[1])[0]
        const weakest = Object.entries(scores.dimScores).sort((a, b) => a[1] - b[1])[0]
        const strongDim = dimensions.find(d => d.id === strongest[0])?.shortName
        const weakDim = dimensions.find(d => d.id === weakest[0])?.shortName
        return `High ${strongDim}, Growing ${weakDim}`
    }, [dimensionCategories, scores])

    const chartData = useMemo(() => {
        if (!scores) return []
        return dimensions.map(dim => ({
            subject: dim.shortName,
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

    const overallBand = useMemo(() => scores ? getBand(scores.overallScore) : 'low', [scores])

    const shareCaption = useMemo(() => {
        if (!scores || !archetype) return ''
        return `My Career Readiness Score is ${scores.overallScore}/100 – apparently I'm a "${archetype.label}". ${bandConfig[overallBand].label}. What's yours? 🎯`
    }, [scores, archetype, overallBand])

    const handleCopyCaption = async () => {
        try {
            await navigator.clipboard.writeText(shareCaption)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            console.error('Failed to copy text')
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="h-8 w-8 border-t-2 border-primary rounded-full"
            ></motion.div>
        </div>
    )

    if (!results || !scores || !dimensionCategories) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-8">
            <h1 className="text-xl font-headline font-bold text-slate-400 uppercase tracking-widest">No Diagnostic Found</h1>
            <Link href="/survey">
                <button className="bg-primary text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px]">Initialize Assessment</button>
            </Link>
        </div>
    )

    const band = bandConfig[overallBand]

    return (
        <main className="pt-32 pb-24 bg-white min-h-screen font-body text-on-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* ── Hero Header ─────────────────────────────────────── */}
                <header className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-8"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <span className={`border px-4 py-1.5 text-[11px] font-black tracking-widest uppercase rounded-lg ${band.bg} ${band.color}`}>
                                {band.label}
                            </span>
                            <div className="h-px grow bg-slate-100"></div>
                        </div>
                        <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-8">
                            {archetype?.label} <br />
                            <span className="text-primary opacity-20 text-2xl sm:text-4xl md:text-6xl font-bold tracking-widest blur-[0.5px]">READY TO LEAP</span>
                        </h1>
                        <p className="text-slate-500 text-xl md:text-2xl max-w-3xl leading-relaxed font-medium mb-6">
                            {archetype?.description}
                        </p>
                        <p className="text-slate-400 italic text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                            Be honest: are you driving your career or just riding along? These results are your starting line.
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
                                <span className="block text-[11px] font-black text-slate-400 tracking-widest uppercase mt-1">out of 100</span>
                                <span className={`block text-[10px] font-black tracking-widest uppercase mt-3 px-3 py-1 rounded-full border ${band.bg} ${band.color}`}>
                                    {overallBand === 'high' ? 'High' : overallBand === 'medium' ? 'Medium' : 'Low'} Readiness
                                </span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col items-center lg:items-end gap-1">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">Dimensional Architecture Profile</span>
                            <p className="text-sm md:text-base font-extrabold text-slate-800 uppercase tracking-widest text-center lg:text-right border-b-2 border-slate-100 pb-1">
                                {profileSummary}
                            </p>
                        </div>
                    </motion.div>
                </header>

                {/* ── User Context Summary ────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-slate-900 p-8 md:p-12 rounded-3xl text-white mb-10 shadow-2xl relative overflow-hidden ring-1 ring-white/10"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 mb-8 border-b border-white/10 pb-8">
                        <h3 className="text-2xl font-headline font-extrabold text-white mb-2">Profile Baseline</h3>
                        <p className="text-white/50 text-sm font-medium max-w-3xl leading-relaxed">
                            Your baseline tier and strategic north star provide the vital context for your diagnostic results, ensuring your scores are personalized to your specific career transition and long-term trajectory.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-center">
                        <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Baseline Tier</p>
                            <p className="text-2xl font-extrabold tracking-tight truncate">{results.userData.role}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Strategic North Star</p>
                            <p className="text-xl font-semibold text-white/90 truncate">{results.userData.goal}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Readiness Band</p>
                            <div className="flex items-center gap-3">
                                <span className={`h-2 w-2 rounded-full ${band.color.replace('text-', 'bg-')}`}></span>
                                <p className={`text-xl font-bold tracking-tight ${band.color}`}>{band.label}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Career Profile</p>
                            <p className="text-sm font-bold text-white/70 leading-tight border-l-2 border-white/10 pl-4">{profileSummary}</p>
                        </div>
                    </div>
                </motion.section>

                {/* ── Dimensional Architecture ────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-50/50 p-8 md:p-16 lg:p-24 rounded-4xl border border-slate-100 mb-32 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-20">
                        <div>
                            <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Dimensional Architecture</h2>
                            <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed font-medium max-w-2xl">
                                This multi-dimensional analysis breaks down your professional readiness into five core pillars, allowing you to identify hidden imbalances and prioritize the most impactful growth areas for your current transition.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-slate-200 hidden md:block"></div>
                            <span className="text-[11px] font-black tracking-widest text-primary/60 uppercase bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm">Verified Diagnostic Profile</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                        <div className="lg:col-span-5 aspect-square w-full max-w-[450px] mx-auto bg-white rounded-full p-8 shadow-inner-lg border border-slate-50/50">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#f1f5f9" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontStyle: 'bold', fontWeight: 800, textAnchor: 'middle' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Readiness"
                                        dataKey="A"
                                        stroke="#1847a4"
                                        fill="#1847a4"
                                        fillOpacity={0.15}
                                        strokeWidth={3}
                                        animationDuration={1500}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="lg:col-span-7 space-y-12">
                            {dimensions.map((dim) => (
                                <div key={dim.id} className="group">
                                    <div className="flex justify-between mb-3 items-end">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                                                <span className="material-symbols-outlined text-xl">{dim.icon}</span>
                                            </div>
                                            <div>
                                                <span className="font-headline font-black text-xs uppercase tracking-widest text-slate-500 block mb-0.5">{dim.shortName}</span>
                                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md border inline-block ${dimensionCategories[dim.id] === 'strong' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    dimensionCategories[dim.id] === 'solid' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {dimensionCategories[dim.id]}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-primary font-black text-2xl tabular-nums tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
                                            {scores.dimScores[dim.id]}<span className="text-xs ml-1 opacity-40">%</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 w-full rounded-full overflow-hidden mb-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${scores.dimScores[dim.id]}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(24,71,164,0.3)]"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium pl-14 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {dimensionInsights[dim.id]?.[dimensionCategories[dim.id]]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ── Dimensional Insights ────────────────────────────── */}
                <div className="mb-32">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-4 px-4">Dimensional Insights</h2>
                    <p className="text-slate-400 text-base mb-16 px-4 font-medium">What your scores actually reveal about where you are right now.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dimensions.map(dim => (
                            <motion.div
                                key={dim.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-10 border border-slate-100 rounded-3xl hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="material-symbols-outlined text-primary/30 group-hover:text-primary transition-colors text-3xl">{dim.icon}</span>
                                    <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${dimensionCategories[dim.id] === 'strong' ? 'bg-green-50 text-green-600 border-green-200' :
                                        dimensionCategories[dim.id] === 'solid' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                            'bg-red-50 text-red-600 border-red-200'
                                        }`}>
                                        {scores.dimScores[dim.id]} — {dimensionCategories[dim.id]}
                                    </span>
                                </div>
                                <h3 className="font-headline font-black text-xs uppercase tracking-widest text-slate-400 mb-4">{dim.name} Analysis</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {dimensionInsights[dim.id]?.[dimensionCategories[dim.id]]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Actionable Blueprint ────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-20 border border-slate-100 rounded-3xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 border border-primary text-primary rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-xl">{lowestDimension?.icon}</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest block">Priority Focus Area</span>
                                <h2 className="font-headline text-xl font-extrabold text-slate-800 tracking-tight">{lowestDimension?.name}</h2>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium mb-12 pl-14">
                            This is your current bottleneck. Fixing it first gives you the highest career growth ROI.
                        </p>

                        <h3 className="font-headline font-extrabold text-lg text-on-surface mb-8 tracking-tight">Your 3-Step Action Plan</h3>
                        <div className="space-y-8">
                            {lowestDimension?.actionPlan.map((step, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-sm">{step}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-12 border-t border-slate-50">
                            <div className="flex gap-6 items-start">
                                <div className="w-8 h-8 border border-slate-200 text-slate-300 rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">rocket_launch</span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Momentum Strategy</span>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Leverage your strengths in <strong>{Object.entries(scores.dimScores).sort((a, b) => b[1] - a[1])[0] && dimensions.find(d => d.id === Object.entries(scores.dimScores).sort((a, b) => b[1] - a[1])[0][0])?.name}</strong> to initiate a Career Sprint and move into the next readiness band.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Share & Broadcast ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-primary p-8 sm:p-12 md:p-16 rounded-3xl flex flex-col text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <div className="relative z-10 mb-10">
                            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold mb-4 tracking-tight">Broadcast Results.</h2>
                            <p className="text-white/60 text-base mb-8 max-w-sm leading-relaxed font-medium">
                                Share your Career Readiness Score and challenge your network. Who&apos;s ready to leap?
                            </p>

                            {/* Pre-written share caption */}
                            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Pre-written Caption</p>
                                <p className="text-white/90 text-sm font-medium leading-relaxed mb-6 italic">&ldquo;{shareCaption}&rdquo;</p>
                                <button
                                    onClick={handleCopyCaption}
                                    className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all ${copied ? 'text-green-300' : 'text-white/60 hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {copied ? 'check_circle' : 'content_copy'}
                                    </span>
                                    {copied ? 'Copied to clipboard!' : 'Copy caption'}
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col w-full gap-4">
                            {/* LinkedIn share */}
                            <button
                                onClick={() => {
                                    const text = shareCaption
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`, '_blank')
                                }}
                                className="border-2 border-white text-white! px-8 py-5 rounded-xl font-headline font-bold text-xs tracking-widest uppercase transition-all hover:bg-white hover:text-primary! active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined text-base">share</span>
                                Share on LinkedIn
                            </button>

                            {/* Download buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleDownloadImage(false)}
                                    disabled={isExporting}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-black py-5 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    {isExporting ? 'Generating...' : 'Save Report'}
                                </button>
                                <button
                                    onClick={() => handleDownloadImage(true)}
                                    disabled={isExportingVertical}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-black py-5 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">smart_display</span>
                                    {isExportingVertical ? 'Generating...' : 'Save as Story'}
                                </button>
                            </div>

                            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest text-center mt-4">
                                Save this and plan your next move this week.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── OFF-SCREEN CAPTURE CONTAINERS ────────────────────── */}
            <div className="absolute left-[-9999px] top-0 overflow-hidden">

                {/* Horizontal (1200×630) */}
                <div
                    ref={reportRef}
                    style={{
                        width: 1200, height: 630, background: '#ffffff',
                        padding: '48px 56px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', position: 'relative',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Soft bg glow */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 500, height: 500, background: 'rgba(24,71,164,0.05)', borderRadius: '50%', filter: 'blur(100px)', transform: 'translate(30%, -30%)' }} />

                    {/* TOP ROW — Logo + Date + Band */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="logo" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>PerformanceCore</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Career Readiness Diagnostic</div>
                            </div>
                        </div>
                        {/* Date + Band */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                            <span style={{
                                fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                                padding: '6px 16px', borderRadius: 99, border: `1.5px solid`,
                                borderColor: overallBand === 'high' ? '#bbf7d0' : overallBand === 'medium' ? '#fde68a' : '#fecaca',
                                background: overallBand === 'high' ? '#f0fdf4' : overallBand === 'medium' ? '#fffbeb' : '#fef2f2',
                                color: overallBand === 'high' ? '#16a34a' : overallBand === 'medium' ? '#d97706' : '#dc2626',
                            }}>{band.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* MIDDLE ROW — Archetype + Score Circle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10, flex: 1, paddingTop: 28 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#1847a4', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>{archetype?.tagline}</div>
                            <div style={{ fontSize: 88, fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: 16, letterSpacing: '-3px' }}>
                                {archetype?.label}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 20 }}>{profileSummary}</div>
                            <div style={{ display: 'inline-block', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 99, padding: '6px 20px', fontSize: 12, fontWeight: 700, color: '#475569' }}>
                                &quot;Be honest — are you driving your career or just riding along?&quot;
                            </div>
                        </div>
                        {/* Score Circle */}
                        <div style={{ width: 220, height: 220, borderRadius: '50%', border: '1.5px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 80, fontWeight: 900, color: '#1847a4', lineHeight: 1, letterSpacing: '-4px' }}>{scores.overallScore}</div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>out of 100</div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM ROW — Dimension bars + URL */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: 20, position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', gap: 32 }}>
                            {dimensions.map(dim => (
                                <div key={dim.id} style={{ textAlign: 'center' }}>
                                    <div style={{ width: 10, height: 64, background: '#f8fafc', borderRadius: 99, margin: '0 auto', position: 'relative', overflow: 'hidden', marginBottom: 8, border: '1px solid #e2e8f0' }}>
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#1847a4', borderRadius: 99, height: `${scores.dimScores[dim.id]}%` }} />
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{scores.dimScores[dim.id]}%</div>
                                    <div style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', marginTop: 3 }}>{dim.shortName}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontStyle: 'italic' }}>Save this and plan your next move this week.</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>www.performancecore.app</div>
                        </div>
                    </div>
                </div>

                {/* Vertical (1080×1920) Story */}
                <div
                    ref={verticalReportRef}
                    style={{
                        width: 1080, height: 1920, background: '#ffffff',
                        padding: '80px 80px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', position: 'relative',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Soft bg glow */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 900, height: 900, background: 'rgba(24,71,164,0.04)', borderRadius: '50%', filter: 'blur(180px)', transform: 'translate(40%, -40%)' }} />

                    {/* TOP — Brand Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="logo" style={{ height: 60, width: 'auto', objectFit: 'contain' }} />
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>PerformanceCore</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Career Readiness Diagnostic</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* MIDDLE — Score + Archetype */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10, flex: 1, justifyContent: 'center', gap: 32 }}>
                        {/* Big score circle */}
                        <div style={{ width: 560, height: 560, borderRadius: '50%', border: '2px solid #e2e8f0', boxShadow: '0 40px 120px rgba(0,0,0,0.10)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 210, fontWeight: 900, color: '#1847a4', lineHeight: 1, letterSpacing: '-8px' }}>{scores.overallScore}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 8 }}>out of 100</div>
                            </div>
                        </div>

                        {/* Band badge */}
                        <span style={{
                            fontSize: 22, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
                            padding: '14px 40px', borderRadius: 16, border: '2px solid',
                            borderColor: overallBand === 'high' ? '#bbf7d0' : overallBand === 'medium' ? '#fde68a' : '#fecaca',
                            background: overallBand === 'high' ? '#f0fdf4' : overallBand === 'medium' ? '#fffbeb' : '#fef2f2',
                            color: overallBand === 'high' ? '#16a34a' : overallBand === 'medium' ? '#d97706' : '#dc2626',
                        }}>{band.label}</span>

                        {/* Archetype */}
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#1847a4', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>{archetype?.tagline}</div>
                            <div style={{ fontSize: 100, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-4px', marginBottom: 20 }}>{archetype?.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{profileSummary}</div>
                        </div>

                        {/* Dimension bars */}
                        <div style={{ width: '100%', paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 28 }}>
                            {dimensions.map(dim => (
                                <div key={dim.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                                        <span style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{dim.shortName}</span>
                                        <span style={{ fontSize: 32, fontWeight: 900, color: '#1847a4' }}>{scores.dimScores[dim.id]}%</span>
                                    </div>
                                    <div style={{ height: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ width: `${scores.dimScores[dim.id]}%`, background: '#1847a4', height: '100%', borderRadius: 99 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOTTOM — CTA */}
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, paddingBottom: 20 }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontStyle: 'italic' }}>Ready to make your next big move?</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>What&apos;s your score? Challenge a friend 👇</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.15em' }}>www.performancecore.app</div>
                    </div>
                </div>
            </div>
        </main>
    )
}
