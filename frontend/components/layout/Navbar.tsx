'use client'

import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Brain, Github, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <motion.nav
            className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <motion.div
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">BrandVoice AI</span>
                    </motion.div>

                    <div className="hidden md:flex items-center space-x-8">
                        {["Features", "Team", "Roadmap"].map((item, index) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                                whileHover={{ y: -1 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg cursor-pointer">
                                Get Started
                            </Button>
                        </motion.div>
                        <a href="https://github.com/bhavyaajainn/BrandVoice" target='_blank'>
                            <Github className='w-5 h-5' />
                        </a>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <motion.div
                        className="md:hidden flex flex-col gap-4 mt-4 pb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {["Features", "Team", "Roadmap"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-700 hover:text-gray-900 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="flex items-center gap-5">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-3/4">
                            Get Started
                        </Button>
                        <a href="https://github.com/bhavyaajainn/BrandVoice" target='_blank'>
                            <Github className='w-5 h-5' />
                        </a>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}

export default Navbar
