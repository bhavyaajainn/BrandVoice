import { keyFeatures } from '@/lib/data'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

const Features = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Why BrandVoice AI Stands Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyFeatures.map((feature, index) => (
                    <Card key={index} className={`border ${feature.color}`}>
                        <CardContent>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                    <div className="p-2 rounded-lg mr-4 bg-white border border-gray-200">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Features