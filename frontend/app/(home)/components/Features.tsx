import React from 'react'
import { motion } from "framer-motion"
import { features } from '@/lib/data'
import { Card, CardContent } from "@/components/ui/card"

const Features = () => {
    return (
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
    )
}

export default Features