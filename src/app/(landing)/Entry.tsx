import AppButton from '@/components/ui/buttons/AppButton'
import { ROUTES } from '@/routerKeys'
import { Button } from 'antd'
import Link from 'next/link'
import React from 'react'
import { RiLoginCircleFill } from 'react-icons/ri'
import { FadeIn, HoverScale } from '@/components/animations'
import AppContainer from '@/components/ui/layout/AppContainer'
import ParallaxBackground from '@/components/features/background/ParallaxBackground'

const Entry = () => {
    return (
        <div className="space-y-12 md:space-y-16">
            {/* Hero Section with Parallax Background */}
            <ParallaxBackground
                imageSrc="/images/technology.jpg"
                imageAlt="SolarioTech Hero Background"
                overlayOpacity={0.6}
                speed={0.5}
                className='min-h-[80dvh] lg:min-h-[100dvh]'
            >
                <AppContainer>
                    <div id="hero" className="min-h-[80dvh] lg:min-h-[100dvh] scroll-mt-20 flex flex-col justify-center items-center">
                        <FadeIn direction="down" duration={0.8}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg text-center">
                                Welcome to TechnoPark
                            </h1>
                        </FadeIn>
                        <FadeIn direction="up" delay={0.2} duration={0.8}>
                            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4 drop-shadow-md text-center">
                                Build amazing applications with our modern platform
                            </p>
                        </FadeIn>
                        {/* CTA Buttons */}
                        <FadeIn direction="up" delay={0.4} duration={0.8}>
                            <div className="flex gap-3 md:gap-4 justify-center flex-wrap pt-4 md:pt-6">
                                <HoverScale scale={1.05}>
                                    <Link href={ROUTES.AUTH.LOGIN}>
                                        <AppButton
                                            type="primary"
                                            isLoading={false}
                                            prefixIcon={<RiLoginCircleFill />}
                                            className="w-36 md:w-56"
                                        >
                                            Login
                                        </AppButton>
                                    </Link>
                                </HoverScale>
                                <HoverScale scale={1.05}>
                                    <Link href={ROUTES.AUTH.REGISTER}>
                                        <Button size="large" className="w-36 md:w-56">
                                            Create Account
                                        </Button>
                                    </Link>
                                </HoverScale>
                            </div>
                        </FadeIn>
                    </div>
                </AppContainer>
            </ParallaxBackground>

            {/* About Section */}
            <AppContainer>
                <div id="about" className="py-8 md:py-12 space-y-4 md:space-y-6 scroll-mt-20">
                    <FadeIn>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                            About SolarioTech
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center">
                            SolarioTech is a cutting-edge platform designed to help developers and businesses build, deploy, and scale applications efficiently. Our mission is to make technology accessible to everyone.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6">
                            <HoverScale>
                                <div className="p-4 md:p-6 bg-card rounded-lg border shadow-sm">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2">Fast Development</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Build applications faster with our modern tools and frameworks.
                                    </p>
                                </div>
                            </HoverScale>
                            <HoverScale>
                                <div className="p-4 md:p-6 bg-card rounded-lg border shadow-sm">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2">Scalable Solutions</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Scale your applications seamlessly as your business grows.
                                    </p>
                                </div>
                            </HoverScale>
                            <HoverScale>
                                <div className="p-4 md:p-6 bg-card rounded-lg border shadow-sm">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2">24/7 Support</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Get help whenever you need it with our dedicated support team.
                                    </p>
                                </div>
                            </HoverScale>
                        </div>
                    </FadeIn>
                </div>
            </AppContainer>

            {/* Download Section */}
            <AppContainer>
                <div id="download" className="py-8 md:py-12 space-y-4 md:space-y-6 scroll-mt-20">
                    <FadeIn>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                            Download Our App
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center">
                            Get started with SolarioTech today. Available on all major platforms.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="flex gap-3 md:gap-4 justify-center flex-wrap pt-4 md:pt-6">
                            <HoverScale>
                                <Button size="large" className="w-full sm:w-auto">
                                    📱 Download for iOS
                                </Button>
                            </HoverScale>
                            <HoverScale>
                                <Button size="large" className="w-full sm:w-auto">
                                    🤖 Download for Android
                                </Button>
                            </HoverScale>
                            <HoverScale>
                                <Button size="large" className="w-full sm:w-auto">
                                    💻 Download for Desktop
                                </Button>
                            </HoverScale>
                        </div>
                    </FadeIn>
                </div>
            </AppContainer>

            {/* Testimonials Section */}
            <AppContainer>
                <div id="testimonials" className="py-8 md:py-12 space-y-4 md:space-y-6 scroll-mt-20">
                    <FadeIn direction="up">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                            What Our Users Say
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.95}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                            <HoverScale scale={1.03}>
                                <div className="p-4 md:p-6 rounded-lg border hover:shadow-lg transition-shadow">
                                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                                        &quot;SolarioTech transformed how we manage our projects. Highly recommended!&quot;
                                    </p>
                                    <div className="text-sm md:text-base font-semibold">- Sarah Johnson</div>
                                    <div className="text-xs md:text-sm text-muted-foreground">Tech Lead, StartupXYZ</div>
                                </div>
                            </HoverScale>
                            <HoverScale scale={1.03}>
                                <div className="p-4 md:p-6 rounded-lg border hover:shadow-lg transition-shadow">
                                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                                        &quot;The best platform we&apos;ve used. Support team is incredibly responsive.&quot;
                                    </p>
                                    <div className="text-sm md:text-base font-semibold">- Michael Chen</div>
                                    <div className="text-xs md:text-sm text-muted-foreground">CEO, Innovation Co</div>
                                </div>
                            </HoverScale>
                            <HoverScale scale={1.03}>
                                <div className="p-4 md:p-6 rounded-lg border hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
                                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                                        &quot;Switched to SolarioTech and saved 40% on infrastructure costs.&quot;
                                    </p>
                                    <div className="text-sm md:text-base font-semibold">- Emma Wilson</div>
                                    <div className="text-xs md:text-sm text-muted-foreground">CTO, GrowthLabs</div>
                                </div>
                            </HoverScale>
                        </div>
                    </FadeIn>
                </div>
            </AppContainer>

            {/* Contact Section */}
            <ParallaxBackground
                imageSrc="/images/contact.jpg"
                imageAlt="SolarioTech Contact Background"
                overlayOpacity={0.6}
                speed={0.5}
                className='min-h-[80dvh]'
            >
                <AppContainer>
                    <div id="contact" className="min-h-[80dvh] flex justify-center items-center flex-col text-center scroll-mt-20">
                        <FadeIn direction="up" delay={0.2}>
                            <h2 className="text-2xl whiteText sm:text-3xl md:text-4xl font-bold text-center">
                                Get In Touch
                            </h2>
                        </FadeIn>
                        <FadeIn direction="up" delay={0.3}>
                            <p className="whiteText text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-center">
                                Have questions? We&apos;d love to hear from you. Reach out to our team.
                            </p>
                        </FadeIn>
                        <FadeIn direction="up" delay={0.4}>
                            <div className="flex gap-3 md:gap-4 justify-center flex-wrap pt-4 md:pt-6">
                                <Link href={ROUTES.COMMON.CONTACT}>
                                    <HoverScale>
                                        <Button type="primary" size="large" className="w-36 md:w-56">
                                            Contact Us
                                        </Button>
                                    </HoverScale>
                                </Link>
                                <HoverScale>
                                    <Button size="large" className="w-40 md:w-56">
                                        📧 Email Support
                                    </Button>
                                </HoverScale>
                            </div>
                        </FadeIn>
                    </div>
                </AppContainer>
            </ParallaxBackground>
        </div>
    )
}

export default Entry