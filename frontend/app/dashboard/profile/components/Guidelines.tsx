import React from 'react'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Sparkles } from 'lucide-react'
const Guidelines = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 py-4">
                    <CardTitle className="flex items-center text-xl">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        AI Content Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2" />
                            How this information helps AI create better content
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Brand description helps AI understand your company's mission and values
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Target audience information ensures content resonates with the right people
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Brand voice guidelines maintain consistency across all generated content
                                </li>
                            </ul>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Uploaded assets provide visual and contextual references for content creation
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Industry selection helps AI use appropriate terminology and trends
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Multi-select options allow for more nuanced brand personality representation
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default Guidelines