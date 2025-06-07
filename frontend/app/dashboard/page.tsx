"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from "./components/Header"
import Purpose from "./components/Purpose"
import Steps from "./components/Steps"
import Features from "./components/Features"
import { Upload, Brain, Target, BarChart3, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
    const [showOnboarding, setShowOnboarding] = useState(true)
    const [brandName, setBrandName] = useState("")
    const [brandDescription, setBrandDescription] = useState("")
    const [brandLogo, setBrandLogo] = useState<string | null>(null)

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setBrandLogo(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleOnboardingSubmit = () => {
        if (brandName.trim() === "") return
        setShowOnboarding(false)
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

            {/* Floating Background Elements */}
            <motion.div
                className="absolute top-20 right-20 w-32 h-32 bg-blue-50 rounded-full opacity-60"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-40 left-16 w-24 h-24 bg-emerald-50 rounded-full opacity-60"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            <motion.div
                className="absolute bottom-32 right-32 w-20 h-20 bg-violet-50 rounded-full opacity-60"
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Floating Icons */}
            <motion.div
                className="absolute top-32 left-1/4 w-16 h-16 bg-blue-100 rounded-xl lg:flex items-center justify-center hidden"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            >
                <Brain className="w-8 h-8 text-blue-600" />
            </motion.div>

            <motion.div
                className="absolute top-48 right-1/4 w-14 h-14 bg-emerald-100 rounded-lg lg:flex items-center justify-center hidden"
                animate={{
                    y: [0, 12, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <Target className="w-6 h-6 text-emerald-600" />
            </motion.div>

            <motion.div
                className="absolute bottom-40 left-1/3 w-12 h-12 bg-violet-100 rounded-lg lg:flex items-center justify-center hidden"
                animate={{
                    y: [0, -8, 0],
                    rotate: [0, 8, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 2,
                }}
            >
                <BarChart3 className="w-5 h-5 text-violet-600" />
            </motion.div>

            <Header logo={brandLogo} brandName={brandName} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Welcome to your AI-powered content hub
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Welcome{brandName ? `, ${brandName}` : ""}!
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Let's transform your brand voice with AI-powered content to revolutionize your marketing strategy.
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Purpose />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Steps />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Features />
                    </motion.div>
                </div>
            </main>

            <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span>Welcome to BrandVoice AI</span>
                        </DialogTitle>
                        <DialogDescription>
                            Let's set up your brand profile to get started with AI-powered content creation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand-name">Brand Name *</Label>
                            <Input
                                id="brand-name"
                                placeholder="Enter your brand name"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand-description">Brand Description (Optional)</Label>
                            <Textarea
                                id="brand-description"
                                placeholder="Briefly describe your brand and its purpose"
                                value={brandDescription}
                                onChange={(e) => setBrandDescription(e.target.value)}
                                rows={3}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand-logo">Brand Logo (Optional)</Label>
                            <div className="flex items-center space-x-4">
                                {brandLogo ? (
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                                        <Image
                                            src={brandLogo || "/placeholder.svg"}
                                            alt="Brand Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity text-xs"
                                            onClick={() => setBrandLogo(null)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <Input id="brand-logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById("brand-logo")?.click()}
                                        className="border-gray-300 hover:border-blue-500"
                                    >
                                        {brandLogo ? "Change Logo" : "Upload Logo"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setShowOnboarding(false)}>
                            Skip for now
                        </Button>
                        <Link href={"/dashboard"}>
                            <Button
                                type="button"
                                onClick={handleOnboardingSubmit}
                                disabled={!brandName.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
