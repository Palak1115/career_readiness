"use client";

import React from 'react'
import { motion } from 'framer-motion'
import Antd from "@/ui/antd";
import logger from "@/utils/logger";
import { FaLinkedin, FaEnvelope, FaXTwitter, FaInstagram } from 'react-icons/fa6'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-6 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">

                {/* Centered heading above both columns */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-headline font-extrabold text-4xl md:text-5xl text-on-background tracking-tighter leading-tight text-center mb-12"
                >
                    Get in <span className="text-primary italic font-serif">Touch</span>
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Contact Info Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            {/* Badge + headline moved here */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-white! text-xl">contact_support</span>
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Contact Hub</span>
                            </div>

                            <p className="text-slate-400 font-medium leading-relaxed mb-10">
                                Connect with the team behind the diagnostic standard. We are here to support your journey towards career excellence.
                            </p>

                            <h2 className="text-lg font-headline font-black text-on-background mb-6">
                                Contact Information
                            </h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                        <FaEnvelope className="text-primary" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Direct Support</p>
                                        <p className="text-on-background font-bold">support@performancecore.ai</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Response Hours</p>
                                        <p className="text-on-background font-bold">Mon – Fri, 9:00 AM – 6:00 PM EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Headquarters</p>
                                        <p className="text-on-background font-bold">Global · Remote-First Precision Team</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-slate-50 flex items-center gap-6">
                            <Link href="https://linkedin.com" target="_blank" className="text-slate-400 hover:text-primary transition-all hover:scale-110">
                                <FaLinkedin size={22} />
                            </Link>
                            <Link href="https://twitter.com" target="_blank" className="text-slate-400 hover:text-primary transition-all hover:scale-110">
                                <FaXTwitter size={22} />
                            </Link>
                            <Link href="https://instagram.com" target="_blank" className="text-slate-400 hover:text-primary transition-all hover:scale-110">
                                <FaInstagram size={22} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Form Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm"
                    >
                        <h2 className="text-2xl font-headline font-black text-on-background mb-8">
                            Send Us a Message
                        </h2>

                        <Antd.Form
                            layout="vertical"
                            requiredMark={false}
                            onFinish={(values) => {
                                logger.log("Contact Form Data:", values);
                            }}
                            className="space-y-2"
                        >
                            <Antd.Form.Item
                                label={<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Name</span>}
                                name="name"
                                rules={[{ required: true, message: "Identification required" }]}
                            >
                                <Antd.Input
                                    placeholder="Your professional name"
                                    className="rounded-xl border-slate-100 p-3 h-12 font-medium"
                                />
                            </Antd.Form.Item>

                            <Antd.Form.Item
                                label={<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email Address</span>}
                                name="email"
                                rules={[
                                    { required: true, message: "Contact channel required" },
                                    { type: "email", message: "Valid communication protocol required" },
                                ]}
                            >
                                <Antd.Input
                                    placeholder="you@professional.com"
                                    className="rounded-xl border-slate-100 p-3 h-12 font-medium"
                                />
                            </Antd.Form.Item>

                            <Antd.Form.Item
                                label={<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Message Brief</span>}
                                name="message"
                                rules={[{ required: true, message: "Context required" }]}
                            >
                                <Antd.Input.TextArea
                                    rows={5}
                                    placeholder="Provide details on your inquiry or feedback..."
                                    className="rounded-xl border-slate-100 p-4 font-medium"
                                />
                            </Antd.Form.Item>

                            <Antd.Form.Item className="mb-0 pt-6">
                                <Antd.Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full h-14 rounded-xl font-headline font-bold text-xs tracking-[0.2em] uppercase bg-primary! text-white! shadow-[0_15px_30px_rgba(24,71,164,0.25)] transition-all hover:bg-primary/95 hover:-translate-y-0.5"
                                >
                                    Transmit Message
                                </Antd.Button>
                            </Antd.Form.Item>
                        </Antd.Form>
                    </motion.div>
                </div>
                <br />
                <br />
                <p className="mt-20 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    By contacting us, you agree to our <Link href="/terms" className="text-primary! hover:underline">TERMS</Link> AND <Link href="/privacy" className="text-primary! hover:underline">PRIVACY FRAMEWORK</Link>.
                </p>
            </div>
        </div>
    );
}
