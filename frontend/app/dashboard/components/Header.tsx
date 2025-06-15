'use client'

import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"
import { Brain, LogOut } from 'lucide-react'
import { useAuthContext } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = ({ logo = null, brandName = null }: { logo?: string | null, brandName?: string | null }) => {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const pathname = usePathname();
    const {  logout } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (pathname) {
            const pathSegments = pathname.split('/').filter(Boolean);
            setActiveTab(pathSegments[pathSegments.length - 1] || "dashboard");
        }
    }, [pathname]);

    const isDashboardPath = pathname === '/dashboard' ||
        pathname?.startsWith('/dashboard/content-studio') ||
        pathname?.startsWith('/dashboard/channel-integrations') ||
        pathname?.startsWith('/dashboard/content-library') ||
        pathname?.startsWith('/dashboard/smart-scheduler') ||
        pathname?.startsWith('/dashboard/insight-hub') ||
        pathname?.startsWith('/dashboard/profile');

    if (pathname === '/' || !isDashboardPath) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutConfirm(false);
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-semibold text-gray-900">BrandVoice AI</span>
                        </div>
                    </div>

                        <nav className="hidden lg:flex space-x-1">
                            {[
                                { href: "/dashboard", label: "Dashboard", id: "dashboard" },
                                { href: "/dashboard/content-studio", label: "Content Studio", id: "content-studio" },
                                { href: "/dashboard/channel-integrations", label: "Channel Integrations", id: "channel-integrations" },
                                { href: "/dashboard/content-library", label: "Content Library", id: "content-library" },
                                { href: "/dashboard/smart-scheduler", label: "Smart Scheduler", id: "smart-scheduler" },
                                { href: "/dashboard/insight-hub", label: "Insight Hub", id: "insight-hub" }
                            ].map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === item.id
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        } transition-colors duration-200`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center">
                            <Link href={"/dashboard/profile"}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarImage src={logo || ""} alt="Brand Logo" />
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {brandName ? brandName.charAt(0).toUpperCase() : "B"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="ml-4 flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>

                        <div className="lg:hidden">
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

                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {[
                                { href: "/dashboard", label: "Dashboard", id: "dashboard" },
                                { href: "/dashboard/content-studio", label: "Content Studio", id: "content-studio" },
                                { href: "/dashboard/channel-integrations", label: "Channel Integrations", id: "channel-integrations" },
                                { href: "/dashboard/content-library", label: "Content Library", id: "content-library" },
                                { href: "/dashboard/smart-scheduler", label: "Smart Scheduler", id: "smart-scheduler" },
                                { href: "/dashboard/insight-hub", label: "Insight Hub", id: "insight-hub" }
                            ].map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === item.id
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </header>

            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <DialogContent className="w-[90%] sm:max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out of BrandVoice AI?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowLogoutConfirm(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Header