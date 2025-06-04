'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BackgroundSelector from '@/components/BackgroundSelector';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen relative">
            <BackgroundSelector seed={pathname || '/content-studio'} />
            
            {/* Main content */}
            <main className="relative z-10 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-50/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
} 