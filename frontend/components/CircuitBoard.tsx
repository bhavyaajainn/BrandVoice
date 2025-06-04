import React from 'react';

const CircuitBoard: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-screen h-screen">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '100vh', minWidth: '100vw' }}>
    <defs>
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity={0.06} />
            <stop offset="50%" stopColor="#334155" stopOpacity={0.03} />
            <stop offset="100%" stopColor="#475569" stopOpacity={0.06} />
        </linearGradient>
        <pattern id="circuitGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#64748b" strokeWidth="0.5" opacity="0.1"/>
            <circle cx="40" cy="40" r="1" fill="#64748b" opacity="0.15">
                <animate attributeName="opacity" values="0.05;0.25;0.05" dur="12s" repeatCount="indefinite"/>
            </circle>
        </pattern>
        <filter id="circuitGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <rect width="1920" height="1080" fill="url(#circuitGrad)"/>
    <rect width="1920" height="1080" fill="url(#circuitGrid)"/>
    
    {/* Left Side Circuit Paths - Dense */}
    <g id="left-circuits">
        {/* Main circuit paths from left edge */}
        <g stroke="#10b981" strokeWidth="3" fill="none" opacity="0.6">
            <path d="M0,200 L200,200 L200,300 L400,300 L400,400 L600,400">
                <animate attributeName="stroke-dasharray" values="0,1200;60,1200;0,1200" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite"/>
            </path>
            <path d="M0,350 L180,350 L180,250 L380,250 L380,450 L580,450">
                <animate attributeName="stroke-dasharray" values="0,1000;50,1000;0,1000" dur="4s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" begin="1s"/>
            </path>
            <path d="M0,500 L220,500 L220,600 L420,600 L420,700 L620,700">
                <animate attributeName="stroke-dasharray" values="0,1100;55,1100;0,1100" dur="6s" repeatCount="indefinite" begin="2s"/>
                <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="6s" repeatCount="indefinite" begin="2s"/>
            </path>
            <path d="M0,750 L160,750 L160,650 L360,650 L360,550 L560,550">
                <animate attributeName="stroke-dasharray" values="0,900;45,900;0,900" dur="4.5s" repeatCount="indefinite" begin="3s"/>
                <animate attributeName="stroke-opacity" values="0.35;0.85;0.35" dur="4.5s" repeatCount="indefinite" begin="3s"/>
            </path>
        </g>
        
        {/* Vertical paths on left edge */}
        <g stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5">
            <path d="M50,0 L50,300 L150,300 L150,600 L250,600 L250,1080">
                <animate attributeName="stroke-dasharray" values="0,1500;40,1500;0,1500" dur="7s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="7s" repeatCount="indefinite"/>
            </path>
            <path d="M120,0 L120,250 L220,250 L220,550 L320,550 L320,1080">
                <animate attributeName="stroke-dasharray" values="0,1400;35,1400;0,1400" dur="6s" repeatCount="indefinite" begin="1.5s"/>
                <animate attributeName="stroke-opacity" values="0.25;0.65;0.25" dur="6s" repeatCount="indefinite" begin="1.5s"/>
            </path>
        </g>
        
        {/* Left edge circuit nodes */}
        <g fill="#10b981">
            <circle cx="50" cy="200" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="350" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="500" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="750" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="2.8s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Left side microchips */}
        <g fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4">
            <rect x="160" y="170" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;5,0;0,0" dur="8s" repeatCount="indefinite"/>
            </rect>
            <rect x="140" y="320" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-3,2;0,0" dur="6s" repeatCount="indefinite"/>
            </rect>
            <rect x="180" y="470" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;4,-1;0,0" dur="7s" repeatCount="indefinite"/>
            </rect>
        </g>
    </g>
    
    {/* Right Side Circuit Paths - Dense */}
    <g id="right-circuits">
        {/* Main circuit paths to right edge */}
        <g stroke="#10b981" strokeWidth="3" fill="none" opacity="0.6">
            <path d="M1920,200 L1720,200 L1720,300 L1520,300 L1520,400 L1320,400">
                <animate attributeName="stroke-dasharray" values="0,1200;60,1200;0,1200" dur="5s" repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite" begin="0.5s"/>
            </path>
            <path d="M1920,350 L1740,350 L1740,250 L1540,250 L1540,450 L1340,450">
                <animate attributeName="stroke-dasharray" values="0,1000;50,1000;0,1000" dur="4s" repeatCount="indefinite" begin="1.5s"/>
                <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" begin="1.5s"/>
            </path>
            <path d="M1920,500 L1700,500 L1700,600 L1500,600 L1500,700 L1300,700">
                <animate attributeName="stroke-dasharray" values="0,1100;55,1100;0,1100" dur="6s" repeatCount="indefinite" begin="2.5s"/>
                <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="6s" repeatCount="indefinite" begin="2.5s"/>
            </path>
            <path d="M1920,750 L1760,750 L1760,650 L1560,650 L1560,550 L1360,550">
                <animate attributeName="stroke-dasharray" values="0,900;45,900;0,900" dur="4.5s" repeatCount="indefinite" begin="3.5s"/>
                <animate attributeName="stroke-opacity" values="0.35;0.85;0.35" dur="4.5s" repeatCount="indefinite" begin="3.5s"/>
            </path>
        </g>
        
        {/* Vertical paths on right edge */}
        <g stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5">
            <path d="M1870,0 L1870,300 L1770,300 L1770,600 L1670,600 L1670,1080">
                <animate attributeName="stroke-dasharray" values="0,1500;40,1500;0,1500" dur="7s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="7s" repeatCount="indefinite" begin="1s"/>
            </path>
            <path d="M1800,0 L1800,250 L1700,250 L1700,550 L1600,550 L1600,1080">
                <animate attributeName="stroke-dasharray" values="0,1400;35,1400;0,1400" dur="6s" repeatCount="indefinite" begin="2.5s"/>
                <animate attributeName="stroke-opacity" values="0.25;0.65;0.25" dur="6s" repeatCount="indefinite" begin="2.5s"/>
            </path>
        </g>
        
        {/* Right edge circuit nodes */}
        <g fill="#10b981">
            <circle cx="1870" cy="200" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;15,8;0,0" dur="10s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="350" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-10,5;0,0" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="500" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;12,-3;0,0" dur="12s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="750" r="8" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="6;10;6" dur="2.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-8,10;0,0" dur="9s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Right side microchips */}
        <g fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4">
            <rect x="1680" y="170" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" begin="1s"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-5,0;0,0" dur="8s" repeatCount="indefinite"/>
            </rect>
            <rect x="1700" y="320" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" begin="1s"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;3,2;0,0" dur="6s" repeatCount="indefinite"/>
            </rect>
            <rect x="1660" y="470" width="80" height="60" rx="8">
                <animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="5s" repeatCount="indefinite" begin="1s"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-4,-1;0,0" dur="7s" repeatCount="indefinite"/>
            </rect>
        </g>
    </g>
    
    {/* Center Circuit Network */}
    <g id="center-circuits">
        {/* Central processing units */}
        <g fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.5">
            <rect x="800" y="400" width="120" height="80" rx="10">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="stroke-width" values="2;4;2" dur="4s" repeatCount="indefinite"/>
            </rect>
            <rect x="1000" y="300" width="120" height="80" rx="10">
                <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="stroke-width" values="2;4;2" dur="3.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="600" y="600" width="120" height="80" rx="10">
                <animate attributeName="stroke-opacity" values="0.35;0.85;0.35" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="stroke-width" values="2;4;2" dur="5s" repeatCount="indefinite"/>
            </rect>
        </g>
        
        {/* Central circuit nodes */}
        <g fill="#f59e0b">
            <circle cx="860" cy="440" r="10" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1060" cy="340" r="10" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="660" cy="640" r="10" opacity="0.8" filter="url(#circuitGlow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
            </circle>
        </g>
    </g>
    
    {/* Data pulse particles */}
    <g fill="#f59e0b">
        <circle r="3" opacity="0.9">
            <animateMotion dur="5s" repeatCount="indefinite">
                <path d="M50,200 L200,200 L200,300 L400,300 L400,400 L600,400 L860,440"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;0" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle r="2.5" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
                <path d="M1870,350 L1740,350 L1740,250 L1540,250 L1540,450 L1340,450 L1060,340"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <circle r="4" opacity="0.9">
            <animateMotion dur="6s" repeatCount="indefinite" begin="2s">
                <path d="M50,500 L220,500 L220,600 L420,600 L420,700 L620,700 L660,640"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" begin="2s"/>
        </circle>
    </g>
</svg>
    </div>
  );
};

export default CircuitBoard; 