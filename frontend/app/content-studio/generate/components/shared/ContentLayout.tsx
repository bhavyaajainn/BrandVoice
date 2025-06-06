import React from 'react';
import { Platform } from '../types';

interface ContentLayoutProps {
    platform: Platform;
    platformIcon: React.ReactNode;
    children: React.ReactNode;
}

export const getPlatformStyles = (platform: Platform) => {
    switch (platform) {
        case 'Instagram':
            return {
                modeBg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
                modeText: 'text-white',
                icon: 'text-white'
            };
        case 'Facebook':
            return {
                modeBg: 'bg-[#1877F2]',
                modeText: 'text-white',
                icon: 'text-white'
            };
        case 'X':
            return {
                modeBg: 'bg-black',
                modeText: 'text-white',
                icon: 'text-white'
            };
        case 'YouTube':
            return {
                modeBg: 'bg-[#FF0000]',
                modeText: 'text-white',
                icon: 'text-white'
            };
        default:
            return {
                modeBg: 'bg-white',
                modeText: 'text-gray-900',
                icon: 'text-gray-900'
            };
    }
};

export const ContentLayout: React.FC<ContentLayoutProps> = ({ platform, platformIcon, children }) => {
    const platformStyle = getPlatformStyles(platform);

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Mode Banner */}
            <div className={`h-8 ${platformStyle.modeBg}`}>
                <div className="flex items-center justify-center h-full">
                    <span className={`${platformStyle.icon} mr-2`}>{platformIcon}</span>
                    <span className={`${platformStyle.modeText}`}>{platform} mode</span>
                </div>
            </div>

            {/* Main Content */}
            {children}
        </div>
    );
}; 