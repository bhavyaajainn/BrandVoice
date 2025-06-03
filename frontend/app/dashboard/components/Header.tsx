'use client'

import { Brain } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"


const Header = () => {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [brandLogo, setBrandLogo] = useState<string | null>(null)
    const [brandName, setBrandName] = useState("")

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-semibold text-gray-900">BrandVoice AI</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "dashboard"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab("content-studio")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "content-studio"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Content Studio
                        </button>
                        <button
                            onClick={() => setActiveTab("channel-integrations")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "channel-integrations"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Channel Integrations
                        </button>
                        <button
                            onClick={() => setActiveTab("content-library")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "content-library"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Content Library
                        </button>
                        <button
                            onClick={() => setActiveTab("smart-scheduler")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "smart-scheduler"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Smart Scheduler
                        </button>
                        <button
                            onClick={() => setActiveTab("insight-hub")}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "insight-hub"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                } transition-colors duration-200`}
                        >
                            Insight Hub
                        </button>
                    </nav>

                    {/* Avatar */}
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarImage src={brandLogo || ""} alt="Brand Logo" />
                            <AvatarFallback className="bg-blue-600 text-white">
                                {brandName ? brandName.charAt(0).toUpperCase() : "B"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <button
                                onClick={() => {
                                    setActiveTab("dashboard")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "dashboard"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("content-studio")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "content-studio"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Content Studio
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("channel-integrations")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "channel-integrations"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Channel Integrations
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("content-library")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "content-library"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Content Library
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("smart-scheduler")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "smart-scheduler"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Smart Scheduler
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("insight-hub")
                                    setIsMobileMenuOpen(false)
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "insight-hub"
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Insight Hub
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header