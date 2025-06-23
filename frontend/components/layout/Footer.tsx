import React from 'react'
import { motion } from "framer-motion"
import { Brain, Github } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="py-8 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">BrandVoice AI</span>
                    </div>
                    <p className="text-gray-600 text-center">© 2025 Built for <b>Google Agent Development Kit</b>  Hackathon. <br /> Built with passion and innovation.</p>

                    <div className="flex items-center lg:gap-6">
                        <a href="https://github.com/bhavyaajainn/BrandVoice" target='_blank'>
                            <Github className='w-5 h-5 mt-5 lg:mt-0' />
                        </a>
                        <a href="/privacy_policy.pdf" target="_blank" className="text-gray-600 text-center underline block lg:mt-0 mt-4 lg:ml-0 ml-8">
                            Privacy Policy
                        </a>

                    </div>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer