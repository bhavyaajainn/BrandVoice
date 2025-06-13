import React from 'react';

const BrandMatrix: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-screen h-screen">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '100vh', minWidth: '100vw' }}>
    <defs>
        <linearGradient id="matrixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "#2563eb", stopOpacity: 0.08}} />
            <stop offset="30%" style={{stopColor: "#7c3aed", stopOpacity: 0.04}} />
            <stop offset="70%" style={{stopColor: "#059669", stopOpacity: 0.06}} />
            <stop offset="100%" style={{stopColor: "#dc2626", stopOpacity: 0.08}} />
        </linearGradient>
        <filter id="matrixGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <pattern id="matrix" width="60" height="60" patternUnits="userSpaceOnUse">
            <text x="30" y="30" textAnchor="middle" fill="#10b981" opacity="0.1" fontFamily="monospace" fontSize="8">
                AI
                <animate attributeName="opacity" values="0.05;0.2;0.05" dur="10s" repeatCount="indefinite"/>
            </text>
        </pattern>
        <pattern id="binaryCode" width="100" height="40" patternUnits="userSpaceOnUse">
            <text x="10" y="15" fill="#3b82f6" opacity="0.08" fontFamily="monospace" fontSize="6">1010</text>
            <text x="50" y="15" fill="#3b82f6" opacity="0.08" fontFamily="monospace" fontSize="6">0110</text>
            <text x="10" y="35" fill="#3b82f6" opacity="0.08" fontFamily="monospace" fontSize="6">1101</text>
            <text x="50" y="35" fill="#3b82f6" opacity="0.08" fontFamily="monospace" fontSize="6">0011</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-40;0,0" dur="20s" repeatCount="indefinite"/>
        </pattern>
    </defs>
    
    <rect width="1920" height="1080" fill="url(#matrixGrad)"/>
    <rect width="1920" height="1080" fill="url(#matrix)"/>
    <rect width="1920" height="1080" fill="url(#binaryCode)" opacity="0.3"/>
    
    {/* Left Side Brand Matrix - Dense Animation */}
    <g id="left-brand-matrix">
        {/* Vertical data streams from left edge */}
        <g fill="#2563eb" opacity="0.4">
            <rect x="20" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="6s" repeatCount="indefinite"/>
            </rect>
            <rect x="80" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="5s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" begin="1s"/>
            </rect>
            <rect x="140" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="7s" repeatCount="indefinite" begin="2s"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="7s" repeatCount="indefinite" begin="2s"/>
            </rect>
            <rect x="200" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="4.5s" repeatCount="indefinite" begin="3s"/>
                <animate attributeName="opacity" values="0.4;1;0.4" dur="4.5s" repeatCount="indefinite" begin="3s"/>
            </rect>
        </g>
        
        {/* Brand identity cubes on left */}
        <g fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.5">
            <rect x="50" y="200" width="60" height="60" rx="8">
                <animate attributeName="strokeOpacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;30,20;0,0" dur="12s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 80 230;360 80 230" dur="15s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="120" y="400" width="50" height="50" rx="6">
                <animate attributeName="strokeOpacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-20,35;0,0" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 145 425;-360 145 425" dur="18s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="70" y="600" width="70" height="70" rx="10">
                <animate attributeName="strokeOpacity" values="0.25;0.85;0.25" dur="5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;40,-15;0,0" dur="14s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 105 635;360 105 635" dur="20s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="150" y="800" width="40" height="40" rx="5">
                <animate attributeName="strokeOpacity" values="0.35;0.95;0.35" dur="2.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-25,25;0,0" dur="8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 170 820;-360 170 820" dur="12s" repeatCount="indefinite" additive="sum"/>
            </rect>
        </g>
        
        {/* AI text elements floating on left */}
        <g fill="#10b981" opacity="0.6" fontFamily="monospace" fontWeight="bold">
            <text x="60" y="150" fontSize="24">AI</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;50,30;0,0" dur="16s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="16s" repeatCount="indefinite"/>
            
            <text x="180" y="350" fontSize="18">BRAND</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;-30,40;0,0" dur="14s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="14s" repeatCount="indefinite"/>
            
            <text x="90" y="550" fontSize="20">VOICE</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;35,-20;0,0" dur="18s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="18s" repeatCount="indefinite"/>
            
            <text x="160" y="750" fontSize="16">MATRIX</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;-15,45;0,0" dur="12s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.35;0.85;0.35" dur="12s" repeatCount="indefinite"/>
        </g>
        
        {/* Data packets from left edge */}
        <g fill="#059669">
            <circle r="4" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="8s" repeatCount="indefinite">
                    <path d="M0,200 Q200,180 400,200 Q600,220 800,200 Q1000,180 1200,200 Q1400,220 1600,200 Q1800,180 1920,200"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.5;0" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;6;4;2" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle r="3" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="10s" repeatCount="indefinite" begin="2s">
                    <path d="M0,400 Q200,420 400,400 Q600,380 800,400 Q1000,420 1200,400 Q1400,380 1600,400 Q1800,420 1920,400"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.3;0" dur="10s" repeatCount="indefinite" begin="2s"/>
                <animate attributeName="r" values="2;5;3;2" dur="10s" repeatCount="indefinite" begin="2s"/>
            </circle>
            <circle r="5" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="12s" repeatCount="indefinite" begin="4s">
                    <path d="M0,600 Q200,580 400,600 Q600,620 800,600 Q1000,580 1200,600 Q1400,620 1600,600 Q1800,580 1920,600"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.4;0" dur="12s" repeatCount="indefinite" begin="4s"/>
                <animate attributeName="r" values="3;7;5;3" dur="12s" repeatCount="indefinite" begin="4s"/>
            </circle>
        </g>
    </g>
    
    {/* Right Side Brand Matrix - Dense Animation */}
    <g id="right-brand-matrix">
        {/* Vertical data streams from right edge */}
        <g fill="#dc2626" opacity="0.4">
            <rect x="1897" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="6.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="6.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="1837" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="5.2s" repeatCount="indefinite" begin="1.5s"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5.2s" repeatCount="indefinite" begin="1.5s"/>
            </rect>
            <rect x="1777" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="7.3s" repeatCount="indefinite" begin="2.5s"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="7.3s" repeatCount="indefinite" begin="2.5s"/>
            </rect>
            <rect x="1717" y="0" width="3" height="1080">
                <animate attributeName="height" values="0;1080;0" dur="4.8s" repeatCount="indefinite" begin="3.5s"/>
                <animate attributeName="opacity" values="0.4;1;0.4" dur="4.8s" repeatCount="indefinite" begin="3.5s"/>
            </rect>
        </g>
        
        {/* Brand identity cubes on right */}
        <g fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.5">
            <rect x="1810" y="200" width="60" height="60" rx="8">
                <animate attributeName="strokeOpacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-30,20;0,0" dur="12s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1840 230;-360 1840 230" dur="15s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="1750" y="400" width="50" height="50" rx="6">
                <animate attributeName="strokeOpacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;20,35;0,0" dur="10s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1775 425;360 1775 425" dur="18s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="1780" y="600" width="70" height="70" rx="10">
                <animate attributeName="strokeOpacity" values="0.25;0.85;0.25" dur="5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-40,-15;0,0" dur="14s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1815 635;-360 1815 635" dur="20s" repeatCount="indefinite" additive="sum"/>
            </rect>
            <rect x="1730" y="800" width="40" height="40" rx="5">
                <animate attributeName="strokeOpacity" values="0.35;0.95;0.35" dur="2.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;25,25;0,0" dur="8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="rotate" values="0 1750 820;360 1750 820" dur="12s" repeatCount="indefinite" additive="sum"/>
            </rect>
        </g>
        
        {/* AI text elements floating on right */}
        <g fill="#10b981" opacity="0.6" fontFamily="monospace" fontWeight="bold">
            <text x="1780" y="150" fontSize="24" textAnchor="end">SMART</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;-50,30;0,0" dur="16s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="16s" repeatCount="indefinite"/>
            
            <text x="1820" y="350" fontSize="18" textAnchor="end">CONTENT</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;30,40;0,0" dur="14s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="14s" repeatCount="indefinite"/>
            
            <text x="1850" y="550" fontSize="20" textAnchor="end">FLOW</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;-35,-20;0,0" dur="18s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="18s" repeatCount="indefinite"/>
            
            <text x="1800" y="750" fontSize="16" textAnchor="end">NEURAL</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;15,45;0,0" dur="12s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.35;0.85;0.35" dur="12s" repeatCount="indefinite"/>
        </g>
        
        {/* Data packets to right edge */}
        <g fill="#dc2626">
            <circle r="4" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="8s" repeatCount="indefinite" begin="4s">
                    <path d="M1920,300 Q1720,280 1520,300 Q1320,320 1120,300 Q920,280 720,300 Q520,320 320,300 Q120,280 0,300"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.5;0" dur="8s" repeatCount="indefinite" begin="4s"/>
                <animate attributeName="r" values="2;6;4;2" dur="8s" repeatCount="indefinite" begin="4s"/>
            </circle>
            <circle r="3" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="10s" repeatCount="indefinite" begin="6s">
                    <path d="M1920,500 Q1720,520 1520,500 Q1320,480 1120,500 Q920,520 720,500 Q520,480 320,500 Q120,520 0,500"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.3;0" dur="10s" repeatCount="indefinite" begin="6s"/>
                <animate attributeName="r" values="2;5;3;2" dur="10s" repeatCount="indefinite" begin="6s"/>
            </circle>
            <circle r="5" opacity="0.8" filter="url(#matrixGlow)">
                <animateMotion dur="12s" repeatCount="indefinite" begin="8s">
                    <path d="M1920,700 Q1720,680 1520,700 Q1320,720 1120,700 Q920,680 720,700 Q520,720 320,700 Q120,680 0,700"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.4;0" dur="12s" repeatCount="indefinite" begin="8s"/>
                <animate attributeName="r" values="3;7;5;3" dur="12s" repeatCount="indefinite" begin="8s"/>
            </circle>
        </g>
    </g>
    
    {/* Center Brand Hub */}
    <g id="center-brand-hub">
        {/* Central brand logo representation */}
        <g fill="none" stroke="#2563eb" strokeWidth="4" opacity="0.7">
            <circle cx="960" cy="540" r="80">
                <animate attributeName="strokeOpacity" values="0.4;1;0.4" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="r" values="70;90;70" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="960" cy="540" r="120">
                <animate attributeName="strokeOpacity" values="0.2;0.6;0.2" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="110;130;110" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="960" cy="540" r="160">
                <animate attributeName="strokeOpacity" values="0.1;0.4;0.1" dur="10s" repeatCount="indefinite"/>
                <animate attributeName="r" values="150;170;150" dur="10s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Central AI brain representation */}
        <g fill="#2563eb" opacity="0.6">
            <circle cx="960" cy="540" r="30">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Brand voice visualization bars */}
        <g fill="#10b981" opacity="0.5">
            <rect x="880" y="570" width="8" height="40">
                <animate attributeName="height" values="20;60;20" dur="1.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="900" y="570" width="8" height="50">
                <animate attributeName="height" values="30;70;30" dur="1.8s" repeatCount="indefinite"/>
            </rect>
            <rect x="920" y="570" width="8" height="30">
                <animate attributeName="height" values="15;50;15" dur="1.2s" repeatCount="indefinite"/>
            </rect>
            <rect x="940" y="570" width="8" height="60">
                <animate attributeName="height" values="40;80;40" dur="2s" repeatCount="indefinite"/>
            </rect>
            <rect x="960" y="570" width="8" height="40">
                <animate attributeName="height" values="25;65;25" dur="1.6s" repeatCount="indefinite"/>
            </rect>
            <rect x="980" y="570" width="8" height="35">
                <animate attributeName="height" values="20;55;20" dur="1.3s" repeatCount="indefinite"/>
            </rect>
            <rect x="1000" y="570" width="8" height="45">
                <animate attributeName="height" values="25;65;25" dur="1.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="1020" y="570" width="8" height="55">
                <animate attributeName="height" values="35;75;35" dur="1.9s" repeatCount="indefinite"/>
            </rect>
            <rect x="1040" y="570" width="8" height="25">
                <animate attributeName="height" values="15;45;15" dur="1.4s" repeatCount="indefinite"/>
            </rect>
        </g>
        
        {/* Floating brand elements around center */}
        <g fill="#7c3aed" opacity="0.4">
            <polygon points="760,400 780,380 800,400 780,420">
                <animateTransform attributeName="transform" type="rotate" values="0 780 400;360 780 400" dur="20s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;40,20;0,0" dur="15s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="8s" repeatCount="indefinite"/>
            </polygon>
            <polygon points="1120,400 1140,380 1160,400 1140,420">
                <animateTransform attributeName="transform" type="rotate" values="0 1140 400;-360 1140 400" dur="18s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-40,20;0,0" dur="12s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="10s" repeatCount="indefinite"/>
            </polygon>
            <polygon points="860,680 880,660 900,680 880,700">
                <animateTransform attributeName="transform" type="rotate" values="0 880 680;360 880 680" dur="22s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;30,-25;0,0" dur="18s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="12s" repeatCount="indefinite"/>
            </polygon>
            <polygon points="1020,680 1040,660 1060,680 1040,700">
                <animateTransform attributeName="transform" type="rotate" values="0 1040 680;-360 1040 680" dur="25s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-30,-25;0,0" dur="14s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="opacity" values="0.15;0.85;0.15" dur="16s" repeatCount="indefinite"/>
            </polygon>
        </g>
    </g>
    
    {/* Ambient matrix glow effects */}
    <g fill="url(#matrixGrad)" opacity="0.2">
        <circle cx="300" cy="200" r="100">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="20s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;80,60;0,0" dur="25s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1600" cy="300" r="120">
            <animate attributeName="opacity" values="0.15;0.5;0.15" dur="25s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;-100,40;0,0" dur="30s" repeatCount="indefinite"/>
        </circle>
        <circle cx="500" cy="800" r="80">
            <animate attributeName="opacity" values="0.08;0.3;0.08" dur="18s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;60,-80;0,0" dur="22s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1400" cy="850" r="110">
            <animate attributeName="opacity" values="0.12;0.45;0.12" dur="28s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;-70,70;0,0" dur="35s" repeatCount="indefinite"/>
        </circle>
    </g>
</svg>
    </div>
  );
};

export default BrandMatrix; 