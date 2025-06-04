import React from 'react';

const NeuralNetwork: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-screen h-screen">
      <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#3b82f6", stopOpacity:0.08}} />
                <stop offset="50%" style={{stopColor:"#1e40af", stopOpacity:0.03}} />
                <stop offset="100%" style={{stopColor:"#8b5cf6", stopOpacity:0.08}} />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#3b82f6" opacity="0.1">
                    <animate attributeName="opacity" values="0.05;0.2;0.05" dur="8s" repeatCount="indefinite"/>
                </circle>
            </pattern>
        </defs>
        
        <rect width="1920" height="1080" fill="url(#grad1)"/>
        <rect width="1920" height="1080" fill="url(#dots)"/>
        
        {/* Left Side Animation - More Dense */}
        <g id="left-network">
            {/* Input Layer - Left Edge */}
            <circle cx="50" cy="200" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="300" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="400" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="500" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="600" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="2.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="700" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="800" r="6" fill="#3b82f6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.2s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;8;4" dur="3.2s" repeatCount="indefinite"/>
            </circle>
            
            {/* Hidden Layer 1 - Left Side */}
            <circle cx="250" cy="150" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;10,5;0,0" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="250" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-8,3;0,0" dur="7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="350" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3.2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;12,-2;0,0" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="450" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2.7s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-6,8;0,0" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="550" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;9,-4;0,0" dur="6.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="650" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-5,6;0,0" dur="7.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="750" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="5.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="850" r="6" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2.9s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-10,-3;0,0" dur="6.8s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Center Network */}
        <g id="center-network">
            {/* Hidden Layer 2 - Center */}
            <circle cx="700" cy="200" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="700" cy="320" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="700" cy="440" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="700" cy="560" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="700" cy="680" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3.6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="700" cy="800" r="6" fill="#10b981" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.7s" repeatCount="indefinite"/>
            </circle>
            
            {/* Hidden Layer 3 - Center */}
            <circle cx="1200" cy="250" r="6" fill="#f59e0b" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1200" cy="380" r="6" fill="#f59e0b" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1200" cy="510" r="6" fill="#f59e0b" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1200" cy="640" r="6" fill="#f59e0b" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1200" cy="770" r="6" fill="#f59e0b" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Right Side Animation - More Dense */}
        <g id="right-network">
            {/* Output Layer - Right Edge */}
            <circle cx="1670" cy="200" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;20,10;0,0" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1670" cy="320" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="2.4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-15,8;0,0" dur="7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1670" cy="440" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="2.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;18,-5;0,0" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1670" cy="560" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3.2s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="3.2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-12,12;0,0" dur="9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1670" cy="680" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="1.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;25,0;0,0" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1670" cy="800" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.6s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;9;4" dur="2.6s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-8,-6;0,0" dur="7.5s" repeatCount="indefinite"/>
            </circle>
            
            {/* Additional Right Side Nodes */}
            <circle cx="1870" cy="150" r="4" fill="#ef4444" opacity="0.6" filter="url(#glow)">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;30,20;0,0" dur="10s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="350" r="4" fill="#ef4444" opacity="0.6" filter="url(#glow)">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-20,15;0,0" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="550" r="4" fill="#ef4444" opacity="0.6" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.7s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;25,-10;0,0" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="750" r="4" fill="#ef4444" opacity="0.6" filter="url(#glow)">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-15,25;0,0" dur="9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1870" cy="900" r="4" fill="#ef4444" opacity="0.6" filter="url(#glow)">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4.2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;35,0;0,0" dur="7s" repeatCount="indefinite"/>
            </circle>
        </g>
        
        {/* Connections with animated data flow */}
        <g strokeWidth="1" strokeOpacity="0.2" fill="none">
            {/* Left to center connections */}
            <line x1="56" y1="200" x2="244" y2="150" stroke="#3b82f6">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
            </line>
            <line x1="56" y1="300" x2="244" y2="250" stroke="#3b82f6">
                <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite"/>
            </line>
            <line x1="256" y1="250" x2="694" y2="200" stroke="#8b5cf6">
                <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="2.8s" repeatCount="indefinite"/>
            </line>
            <line x1="706" y1="320" x2="1194" y2="250" stroke="#10b981">
                <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
            </line>
            
            {/* Data pulse particles */}
            <circle r="2" fill="#3b82f6" opacity="0.8">
                <animateMotion dur="5s" repeatCount="indefinite">
                    <path d="M56,200 L244,150 L694,200 L1194,250 L1664,200"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle r="1.5" fill="#8b5cf6" opacity="0.8">
                <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
                    <path d="M56,400 L244,350 L694,440 L1194,380 L1664,440"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="1s"/>
            </circle>
            <circle r="2.5" fill="#10b981" opacity="0.8">
                <animateMotion dur="6s" repeatCount="indefinite" begin="2s">
                    <path d="M56,600 L244,650 L694,680 L1194,640 L1664,680"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" begin="2s"/>
            </circle>
        </g>
      </svg>
    </div>
  );
};

export default NeuralNetwork; 