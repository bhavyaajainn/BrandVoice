'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    delay?: number;
}

export default function Card({
    children,
    className = '',
    onClick,
    hover = true,
    delay = 0
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
            onClick={onClick}
            className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                onClick ? 'cursor-pointer' : ''
            } ${className}`}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 bg-gray-50 ${className}`}>
            {children}
        </div>
    );
} 