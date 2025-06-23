"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"

export default function Purpose() {
    return (
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center lg:flex hidden">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900">BrandVoice AI Purpose</CardTitle>
                            <CardDescription className="text-blue-700">
                                How we help you transform your brand communication
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                        BrandVoice AI helps you create consistent, engaging content across all your marketing channels. Our
                        AI-powered platform understands your brand voice and generates content that resonates with your audience,
                        saving you time while improving engagement.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <motion.div
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI-Powered Content Generation
                        </motion.div>
                        <motion.div
                            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            Multi-Channel Publishing
                        </motion.div>
                        <motion.div
                            className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            Smart Scheduling
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
