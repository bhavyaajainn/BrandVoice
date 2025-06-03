import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Purpose = () => {
    return (
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
    )
}

export default Purpose