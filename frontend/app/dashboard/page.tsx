"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Header from "./components/Header"
import Purpose from "./components/Purpose"
import Steps from "./components/Steps"
import Features from "./components/Features"
import Actions from "./components/Actions"
import { Upload } from "lucide-react"

export default function Dashboard() {
    const [showOnboarding, setShowOnboarding] = useState(true)
    const [brandName, setBrandName] = useState("")
    const [brandDescription, setBrandDescription] = useState("")
    const [brandLogo, setBrandLogo] = useState<string | null>(null)

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
            <Header logo={brandLogo} brandName={brandName} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome{brandName ? `, ${brandName}` : ""}!</h1>
                    <p className="text-gray-600 mt-1">Let's transform your brand voice with AI-powered content to market.</p>
                </div>

                <div className="space-y-8">
                    <Purpose />
                    <Steps />

                    <Features />

                    <Actions/>
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
