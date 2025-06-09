'use client';

import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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