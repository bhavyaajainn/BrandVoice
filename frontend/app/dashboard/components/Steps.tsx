import { beginnerJourneySteps } from '@/lib/data'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Steps = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started with BrandVoice AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {beginnerJourneySteps.map((step, index) => (
                    <Link key={`step-${index}-${step.title}`} href={step.url}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="cursor-pointer"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="h-full border border-gray-200 hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    <div className={`${step.color} p-2 rounded-lg mr-4 w-10 h-10 flex items-center justify-center`}>{step.icon}</div>
                                    <div className="mt-4">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{step.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Steps