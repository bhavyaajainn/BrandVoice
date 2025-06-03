"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Calendar, ChevronRight, Globe, MessageSquare, Settings, Upload } from "lucide-react"
import { beginnerJourneySteps, keyFeatures } from "@/lib/data"
import Header from "./components/Header"

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [brandName, setBrandName] = useState("")
  const [brandDescription, setBrandDescription] = useState("")
  const [brandLogo, setBrandLogo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock function to handle file upload
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome{brandName ? `, ${brandName}` : ""}!</h1>
          <p className="text-gray-600 mt-1">Let's transform your brand voice with AI-powered content.</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>BrandVoice AI Purpose</CardTitle>
              <CardDescription>How we help you transform your brand communication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                BrandVoice AI helps you create consistent, engaging content across all your marketing channels. Our
                AI-powered platform understands your brand voice and generates content that resonates with your
                audience, saving you time while improving engagement.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  AI-Powered Content
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  Multi-Channel Publishing
                </div>
                <div className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                  Smart Scheduling
                </div>
                <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  Performance Analytics
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beginner's Journey */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started with BrandVoice AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {beginnerJourneySteps.map((step, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Card className="h-full border border-gray-200 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`${step.color} p-2 rounded-lg mr-4`}>{step.icon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Features / Market Differentiation */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Why BrandVoice AI Stands Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <Card key={index} className={`border ${feature.color}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="p-2 rounded-lg mr-4 bg-white border border-gray-200">{feature.icon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                        {feature.stat}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Create Content</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>Connect Channel</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Post</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to BrandVoice AI</DialogTitle>
            <DialogDescription>Let's set up your brand profile to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input
                id="brand-name"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-logo">Brand Logo (Optional)</Label>
              <div className="flex items-center space-x-4">
                {brandLogo ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={brandLogo || "/placeholder.svg"}
                      alt="Brand Logo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => setBrandLogo(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
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
                  >
                    {brandLogo ? "Change Logo" : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleOnboardingSubmit}
              disabled={!brandName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
