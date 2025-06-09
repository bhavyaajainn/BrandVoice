import React from 'react';

const GeometricParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-screen h-screen">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '100vh', minWidth: '100vw' }}>
    <defs>
        <linearGradient id="geometricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "#7c3aed", stopOpacity: 0.08}} />
            <stop offset="25%" style={{stopColor: "#3b82f6", stopOpacity: 0.04}} />
            <stop offset="75%" style={{stopColor: "#10b981", stopOpacity: 0.06}} />
            <stop offset="100%" style={{stopColor: "#f59e0b", stopOpacity: 0.08}} />
        </linearGradient>
        <filter id="geometricGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <pattern id="dotPattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="60" r="2" fill="#64748b" opacity="0.1">
                <animate attributeName="opacity" values="0.05;0.2;0.05" dur="15s" repeatCount="indefinite"/>
            </circle>
        </pattern>
    </defs>
    
    <rect width="1920" height="1080" fill="url(#geometricGrad)"/>
    <rect width="1920" height="1080" fill="url(#dotPattern)"/>
    
    {/* Left Side Geometric Particles - Dense */}
    <g id="left-particles">
        {/* Floating triangles on left */}
        <g fill="#7c3aed" opacity="0.4">
            <polygon points="80,150 120,200 40,200">
                <animateTransform attributeName="transform" type="translate" values="0,0;20,-40;0,0" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 80 175;360 80 175" dur="20s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="150,300 190,350 110,350">
                <animateTransform attributeName="transform" type="translate" values="0,0;-25,50;0,0" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 150 325;-360 150 325" dur="25s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="60,500 100,550 20,550">
                <animateTransform attributeName="transform" type="translate" values="0,0;30,-20;0,0" dur="7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="7s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 60 525;360 60 525" dur="18s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="120,700 160,750 80,750">
                <animateTransform attributeName="transform" type="translate" values="0,0;-15,35;0,0" dur="9s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.6;0.1" dur="9s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 120 725;-360 120 725" dur="22s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="200,850 240,900 160,900">
                <animateTransform attributeName="transform" type="translate" values="0,0;25,15;0,0" dur="11s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0.85;0.35" dur="11s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 200 875;360 200 875" dur="28s" repeatCount="indefinite" additive="sum"/>
            </polygon>
        </g>
        
        {/* Floating squares on left */}
        <g fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5">
            <rect x="40" y="250" width="40" height="40" rx="5">
                <animateTransform attributeName="transform" type="translate" values="0,0;40,20;0,0" dur="12s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="12s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 60 270;360 60 270" dur="15s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="180" y="450" width="50" height="50" rx="8">
                <animateTransform attributeName="transform" type="translate" values="0,0;-30,40;0,0" dur="14s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="14s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 205 475;-360 205 475" dur="18s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="90" y="600" width="35" height="35" rx="6">
                <animateTransform attributeName="transform" type="translate" values="0,0;50,-25;0,0" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 107.5 617.5;360 107.5 617.5" dur="20s" repeatCount="indefinite" additive="sum"/>
            </rect>
        </g>
        
        {/* Left edge circles */}
        <g fill="#10b981" opacity="0.4">
            <circle cx="30" cy="200" r="20">
                <animateTransform attributeName="transform" type="translate" values="0,0;60,40;0,0" dur="16s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="16s" repeatCount="indefinite"/>
                <animate attributeName="r" values="15;25;15" dur="16s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="400" r="15">
                <animateTransform attributeName="transform" type="translate" values="0,0;-20,60;0,0" dur="13s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="13s" repeatCount="indefinite"/>
                <animate attributeName="r" values="12;18;12" dur="13s" repeatCount="indefinite"/>
            </circle>
            <circle cx="80" cy="800" r="18">
                <animateTransform attributeName="transform" type="translate" values="0,0;45,-30;0,0" dur="18s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.85;0.25" dur="18s" repeatCount="indefinite"/>
                <animate attributeName="r" values="14;22;14" dur="18s" repeatCount="indefinite"/>
            </circle>
        </g>
    </g>
    
    {/* Right Side Geometric Particles - Dense */}
    <g id="right-particles">
        {/* Floating triangles on right */}
        <g fill="#7c3aed" opacity="0.4">
            <polygon points="1840,150 1880,200 1800,200">
                <animateTransform attributeName="transform" type="translate" values="0,0;-20,-40;0,0" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1840 175;-360 1840 175" dur="20s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="1770,300 1810,350 1730,350">
                <animateTransform attributeName="transform" type="translate" values="0,0;25,50;0,0" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1770 325;360 1770 325" dur="25s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="1860,500 1900,550 1820,550">
                <animateTransform attributeName="transform" type="translate" values="0,0;-30,-20;0,0" dur="7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="7s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1860 525;-360 1860 525" dur="18s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="1800,700 1840,750 1760,750">
                <animateTransform attributeName="transform" type="translate" values="0,0;15,35;0,0" dur="9s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.6;0.1" dur="9s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1800 725;360 1800 725" dur="22s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="1720,850 1760,900 1680,900">
                <animateTransform attributeName="transform" type="translate" values="0,0;-25,15;0,0" dur="11s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0.85;0.35" dur="11s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1720 875;-360 1720 875" dur="28s" repeatCount="indefinite" additive="sum"/>
            </polygon>
        </g>
        
        {/* Floating squares on right */}
        <g fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5">
            <rect x="1840" y="250" width="40" height="40" rx="5">
                <animateTransform attributeName="transform" type="translate" values="0,0;-40,20;0,0" dur="12s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="12s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1860 270;-360 1860 270" dur="15s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="1690" y="450" width="50" height="50" rx="8">
                <animateTransform attributeName="transform" type="translate" values="0,0;30,40;0,0" dur="14s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="14s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1715 475;360 1715 475" dur="18s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="1795" y="600" width="35" height="35" rx="6">
                <animateTransform attributeName="transform" type="translate" values="0,0;-50,-25;0,0" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1812.5 617.5;-360 1812.5 617.5" dur="20s" repeatCount="indefinite" additive="sum"/>
            </rect>
        </g>
        
        {/* Right edge circles */}
        <g fill="#10b981" opacity="0.4">
            <circle cx="1890" cy="200" r="20">
                <animateTransform attributeName="transform" type="translate" values="0,0;-60,40;0,0" dur="16s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="16s" repeatCount="indefinite"/>
                <animate attributeName="r" values="15;25;15" dur="16s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="400" r="15">
                <animateTransform attributeName="transform" type="translate" values="0,0;20,60;0,0" dur="13s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="13s" repeatCount="indefinite"/>
                <animate attributeName="r" values="12;18;12" dur="13s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1840" cy="800" r="18">
                <animateTransform attributeName="transform" type="translate" values="0,0;-45,-30;0,0" dur="18s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.85;0.25" dur="18s" repeatCount="indefinite"/>
                <animate attributeName="r" values="14;22;14" dur="18s" repeatCount="indefinite"/>
            </circle>
        </g>
    </g>
    
    {/* Center Floating Elements */}
    <g id="center-particles">
        {/* Large central hexagons */}
        <g fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.6">
            <polygon points="600,300 640,280 680,300 680,340 640,360 600,340">
                <animateTransform attributeName="transform" type="rotate" values="0 640 320;360 640 320" dur="20s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="12s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;20,15;0,0" dur="15s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="1200,500 1240,480 1280,500 1280,540 1240,560 1200,540">
                <animateTransform attributeName="transform" type="rotate" values="0 1240 520;-360 1240 520" dur="25s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="15s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-25,20;0,0" dur="18s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="800,700 840,680 880,700 880,740 840,760 800,740">
                <animateTransform attributeName="transform" type="rotate" values="0 840 720;360 840 720" dur="22s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.35;0.85;0.35" dur="18s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;15,-10;0,0" dur="12s" repeatCount="indefinite" additive="sum"/>
            </polygon>
        </g>
        
        {/* Medium floating circles */}
        <g fill="#3b82f6" opacity="0.5">
            <circle cx="400" cy="200" r="25">
                <animateTransform attributeName="transform" type="translate" values="0,0;60,40;0,0" dur="20s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="20s" repeatCount="indefinite"/>
                <animate attributeName="r" values="20;30;20" dur="20s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1400" cy="350" r="20">
                <animateTransform attributeName="transform" type="translate" values="0,0;-40,50;0,0" dur="17s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="17s" repeatCount="indefinite"/>
                <animate attributeName="r" values="16;24;16" dur="17s" repeatCount="indefinite"/>
            </circle>
            <circle cx="900" cy="150" r="22">
                <animateTransform attributeName="transform" type="translate" values="0,0;30,-20;0,0" dur="14s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="14s" repeatCount="indefinite"/>
                <animate attributeName="r" values="18;26;18" dur="14s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1100" cy="800" r="18">
                <animateTransform attributeName="transform" type="translate" values="0,0;-50,30;0,0" dur="22s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="22s" repeatCount="indefinite"/>
                <animate attributeName="r" values="15;21;15" dur="22s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Small diamonds */}
        <g fill="#10b981" opacity="0.4">
            <polygon points="960,320 980,300 1000,320 980,340">
                <animateTransform attributeName="transform" type="rotate" values="0 980 320;360 980 320" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;25,35;0,0" dur="16s" repeatCount="indefinite" additive="sum"/>
            </polygon>
            <polygon points="520,600 540,580 560,600 540,620">
                <animateTransform attributeName="transform" type="rotate" values="0 540 600;-360 540 600" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-30,20;0,0" dur="13s" repeatCount="indefinite" additive="sum"/>
            </polygon>
        </g>
    </g>
    
    {/* Connecting lines with subtle animation */}
    <g stroke="#64748b" strokeWidth="1" opacity="0.15" fill="none">
        <line x1="80" y1="175" x2="400" y2="225">
            <animate attributeName="stroke-opacity" values="0.05;0.25;0.05" dur="15s" repeatCount="indefinite"/>
        </line>
        <line x1="900" y1="172" x2="1400" y2="375">
            <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="18s" repeatCount="indefinite"/>
        </line>
        <line x1="1840" y1="175" x2="1400" y2="350">
            <animate attributeName="stroke-opacity" values="0.08;0.28;0.08" dur="12s" repeatCount="indefinite"/>
        </line>
        <line x1="540" y1="600" x2="800" y2="720">
            <animate attributeName="stroke-opacity" values="0.06;0.26;0.06" dur="20s" repeatCount="indefinite"/>
        </line>
    </g>
</svg>
    </div>
  );
};

export default GeometricParticles; 