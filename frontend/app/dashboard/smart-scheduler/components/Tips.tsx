import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    CalendarIcon,
    Clock,
    Globe,
} from "lucide-react"

const Tips = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Smart Scheduling Tips</CardTitle>
                <CardDescription>Get the most out of your content scheduling</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Best Posting Times</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Our AI analyzes your audience to suggest optimal posting times for each platform.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Timezone Management</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Schedule content based on your audience's timezone for maximum engagement.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Cross-Platform Publishing</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Schedule the same content across multiple platforms with platform-specific formatting.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Tips