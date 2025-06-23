"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, HelpCircle, Zap, Globe, Share2, BarChart3, Clock, Sparkles } from "lucide-react"
import { faqs } from "@/lib/data"
import { Button } from "@/components/ui/button"

const Intro = ({ setHasStarted }: { setHasStarted: (hasStarted: boolean) => void }) => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

            <motion.div
                className="absolute top-20 right-20 w-40 h-40 bg-blue-50 rounded-full opacity-40 hidden xl:block"
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-40 left-10 w-32 h-32 bg-blue-50 rounded-full opacity-30 hidden xl:block"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -15, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            <motion.div
                className="absolute bottom-32 right-1/4 w-24 h-24 bg-blue-50 rounded-full opacity-40 hidden xl:block"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 4,
                }}
            />

            {/* Floating Icons - Hidden on medium and smaller screens */}
            <motion.div
                className="absolute top-32 left-1/4 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg hidden lg:flex"
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
                <Globe className="w-8 h-8 text-blue-600" />
            </motion.div>

            <motion.div
                className="absolute top-48 right-1/3 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg hidden lg:flex"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -8, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <Share2 className="w-6 h-6 text-blue-600" />
            </motion.div>

            <motion.div
                className="absolute bottom-40 left-1/3 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg hidden lg:flex"
                animate={{
                    y: [0, -12, 0],
                    rotate: [0, 12, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 3,
                }}
            >
                <BarChart3 className="w-5 h-5 text-blue-600" />
            </motion.div>

            <div className="relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                        <motion.div
                            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6 border border-blue-200"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Connect All Your Marketing Channels
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Channel
                            <span className="block text-blue-600">Integrations</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Connect your social media accounts, email platforms, and other marketing channels to publish content
                            seamlessly across all your platforms with AI-powered optimization.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 relative z-10">
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        whileHover={{ y: -4 }}
                    >
                        <Card className="bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span>What are Channel Integrations?</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    Channel integrations allow you to connect all your marketing platforms to BrandVoice AI. Once
                                    connected, you can streamline your entire content workflow:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            icon: <Share2 className="w-5 h-5 text-blue-600" />,
                                            title: "One-Click Publishing",
                                            description: "Publish to multiple platforms simultaneously",
                                            color: "bg-blue-50 border-blue-200",
                                        },
                                        {
                                            icon: <Zap className="w-5 h-5 text-blue-600" />,
                                            title: "Auto-Formatting",
                                            description: "Content automatically adapted for each platform",
                                            color: "bg-blue-50 border-blue-200",
                                        },
                                        {
                                            icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                                            title: "Unified Analytics",
                                            description: "Track performance across all channels",
                                            color: "bg-blue-50 border-blue-200",
                                        },
                                        {
                                            icon: <Clock className="w-5 h-5 text-blue-600" />,
                                            title: "Smart Scheduling",
                                            description: "Optimal timing for each platform",
                                            color: "bg-blue-50 border-blue-200",
                                        },
                                    ].map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            className={`p-4 rounded-xl border ${feature.color} hover:shadow-md transition-all duration-300`}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">{feature.icon}</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-center"
                    >
                        <Card className="bg-blue-50 border-blue-200 shadow-xl relative overflow-hidden">
                            <CardContent className="py-16 relative z-10">
                                <motion.div
                                    className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <Zap className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Connect Your Channels?</h3>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Start by connecting your first platform. We support all major social media networks, email marketing
                                    tools, and content management systems with enterprise-grade security.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="lg"
                                        onClick={() => setHasStarted(false)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        Get Started Now
                                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        whileHover={{ y: -2 }}
                    >
                        <Card className="bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-30 -translate-y-16 translate-x-16 hidden lg:block"></div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-2xl flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
                                            <AccordionTrigger className="text-left hover:text-blue-600 transition-colors font-medium">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Intro
