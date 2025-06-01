"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  BarChart3,
  ArrowRight,
  Play,
  Sparkles,
  Rocket,
  ChevronDown,
  Linkedin,
} from "lucide-react"
import { useState, useRef } from "react"
import { features, team, timeline } from "@/lib/data"
import Navbar from "@/components/layout/Navbar"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}

      <Navbar />


      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Floating Elements */}
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

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
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
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Built for Google Agent Kit 2025 Hackathon
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900"
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
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg group cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
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

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            {/* Main Dashboard Mockup */}
            <motion.div
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative z-10"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >

              {/* Dashboard Image should be here */}

              {/* Header */}
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

              {/* Content Generation Interface */}
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

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ opacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to revolutionize your content marketing strategy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The brilliant minds behind this innovative hackathon project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${member.color} rounded-full mx-auto mb-4 flex items-center justify-center`}
                    >
                      <span className="text-lg font-semibold">{member.initial}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                    <div className="flex justify-center mt-4">
                      {member.socials.map((social, socialIndex) => (
                        <a
                          key={socialIndex}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mx-2 text-gray-600 hover:text-gray-900"
                        >
                          <Linkedin width={20} height={20} className="text-gray-600 hover:text-gray-900" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Development Roadmap</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our planned features and milestones for this hackathon project
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white`}>
                    {item.icon}
                  </div>
                </div>
                <motion.div
                  className="flex-1"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {item.quarter}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Experience the future of AI-powered content marketing with BrandVoice AI
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-lg group"
              >
                <Rocket className="mr-2 w-5 h-5" />
                Launch Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BrandVoice AI</span>
            </div>
            <p className="text-gray-600">© 2024 Hackathon Project. Built with passion and innovation.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
