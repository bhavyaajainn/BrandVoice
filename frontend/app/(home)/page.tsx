"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  BarChart3,
  ArrowRight,
  Play,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { useRef } from "react"
import Navbar from "@/components/layout/Navbar"
import Features from "./components/Features"
import Team from "./components/Team"
import Roadmap from "./components/Roadmap"
import CTA from "./components/CTA"
import Footer from "@/components/layout/Footer"
import Link from "next/link"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        <div className="hidden sm:block">
          <motion.div
            className="absolute top-32 right-16 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-8 h-8 text-blue-600" />
          </motion.div>

          <motion.div
            className="absolute top-48 left-16 w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center"
            animate={{
              y: [0, 15, 0],
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
            className="absolute bottom-32 right-32 w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <BarChart3 className="w-5 h-5 text-violet-600" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2 mt-10">
                <Sparkles className="w-4 h-4 mr-2" />
                Built for Google Agent Kit 2025 Hackathon
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform Your
              <span className="block text-blue-600">Brand Voice</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Create AI-personalized content, adapt it for every platform, and get real-time insights for data-driven,
              multi-channel marketing success.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href={"/dashboard"}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg group cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-lg cursor-pointer"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative z-10"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">BrandVoice AI</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Content Type</div>
                  <div className="flex space-x-2">
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                      Social Media
                    </div>
                    <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-sm">Blog Post</div>
                    <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-sm">Email</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Generated Content</div>
                  <div className="bg-white rounded-md p-3 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">AI</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 mb-1">
                          🚀 Exciting news! Our AI-powered content platform is revolutionizing how brands connect with
                          their audience...
                        </div>
                        <div className="text-xs text-gray-500">Generated for Twitter • 2 minutes ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-emerald-600">94%</div>
                    <div className="text-xs text-emerald-600">Engagement</div>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-violet-600">12K</div>
                    <div className="text-xs text-violet-600">Reach</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-600">8.2</div>
                    <div className="text-xs text-orange-600">Score</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ opacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>


      <Features />

      <Team />

      <Roadmap />

      <CTA />

      <Footer />
    </div>
  )
}
