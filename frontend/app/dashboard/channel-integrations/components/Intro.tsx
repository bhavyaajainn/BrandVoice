import React from 'react'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, CheckCircle, HelpCircle, Zap } from 'lucide-react'
import { faqs } from '@/lib/data'
import { Button } from '@/components/ui/button'

const Intro = ({ setHasStarted }: { setHasStarted: (hasStarted: boolean) => void }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Channel Integrations</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect your social media accounts, email platforms, and other marketing channels to publish content
                            seamlessly across all your platforms.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>What are Channel Integrations?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700">
                                    Channel integrations allow you to connect all your marketing platforms to BrandVoice AI. Once
                                    connected, you can:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">One-Click Publishing</h4>
                                            <p className="text-sm text-gray-600">Publish to multiple platforms simultaneously</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Auto-Formatting</h4>
                                            <p className="text-sm text-gray-600">Content automatically adapted for each platform</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Unified Analytics</h4>
                                            <p className="text-sm text-gray-600">Track performance across all channels</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Smart Scheduling</h4>
                                            <p className="text-sm text-gray-600">Optimal timing for each platform</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="w-5 h-5" />
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center"
                    >
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="py-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Connect Your Channels?</h3>
                                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Start by connecting your first platform. We support all major social media networks, email marketing
                                    tools, and content management systems.
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() => setHasStarted(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg group"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Intro