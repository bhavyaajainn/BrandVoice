'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen relative">
            <main className="relative z-10">
                <div>
                    <div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
} 