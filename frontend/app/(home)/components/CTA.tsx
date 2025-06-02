import React from 'react'
import { motion } from "framer-motion"
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket } from 'lucide-react'

const CTA = () => {
    return (
        <section className="py-12 bg-blue-600">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Experience the future of AI-powered content marketing with BrandVoice AI
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-lg group"
                        >
                            <Rocket className="mr-2 w-5 h-5" />
                            Launch Demo
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default CTA