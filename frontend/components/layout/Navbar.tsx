'use client'

import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Brain, Github, Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useAuthContext } from '@/lib/AuthContext'
import LoginModal from '../auth/LoginModal'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const { user } = useAuthContext()
    const router = useRouter()
    const pathname = usePathname()

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    }

    return (
        <>
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
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-semibold text-gray-900">BrandVoice AI</span>
                            </Link>
                        </motion.div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                                Features
                            </Link>
                            <Link href="#team" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                                Team
                            </Link>
                            <Link href="#roadmap" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                                Roadmap
                            </Link>
                            
                            {user ? (
                                <Button 
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg cursor-pointer"
                                >
                                    Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={openLoginModal}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg cursor-pointer"
                                >
                                    Get Started
                                </Button>
                            )}
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
                            <Link 
                                href="#features" 
                                className="text-gray-700 hover:text-gray-900 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link 
                                href="#team" 
                                className="text-gray-700 hover:text-gray-900 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Team
                            </Link>
                            <Link 
                                href="#roadmap" 
                                className="text-gray-700 hover:text-gray-900 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Roadmap
                            </Link>
                            
                            <div className="flex items-center gap-5">
                                {user ? (
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            router.push('/dashboard');
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                                    >
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => {
                                            openLoginModal();
                                            setIsMenuOpen(false);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                    >
                                        Get Started
                                    </Button>
                                )}
                                <a href="https://github.com/bhavyaajainn/BrandVoice" target='_blank'>
                                    <Github className='w-5 h-5' />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    )
}

export default Navbar