import React from 'react';

const DataFlow: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-screen h-screen">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '100vh', minWidth: '100vw' }}>
    <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.08} />
            <stop offset="30%" stopColor="#0284c7" stopOpacity={0.04} />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#0891b2" stopOpacity={0.08} />
        </linearGradient>
        <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
        </radialGradient>
        <filter id="blur">
            <feGaussianBlur stdDeviation="2"/>
        </filter>
    </defs>
    
    <rect width="1920" height="1080" fill="url(#flowGrad)"/>
    
    <g id="left-streams">
        <g stroke="#0ea5e9" strokeWidth="2" fill="none" opacity="0.4">
            <path d="M20,0 Q40,200 20,400 Q0,600 20,800 Q40,1000 20,1080">
                <animate attributeName="strokeDasharray" values="0,100;20,100;0,100" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>
            </path>
            <path d="M80,0 Q100,180 80,360 Q60,540 80,720 Q100,900 80,1080">
                <animate attributeName="strokeDasharray" values="0,120;25,120;0,120" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
            </path>
            <path d="M140,0 Q160,220 140,440 Q120,660 140,880 Q160,1000 140,1080">
                <animate attributeName="strokeDasharray" values="0,110;18,110;0,110" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.65;0.25" dur="3.5s" repeatCount="indefinite"/>
            </path>
        </g>
        
       
        <g stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.5">
            <path d="M0,150 Q400,120 800,150 Q1200,180 1600,150 Q1760,140 1920,150">
                <animate attributeName="strokeDasharray" values="0,2000;40,2000;0,2000" dur="5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="6s" repeatCount="indefinite"/>
            </path>
            <path d="M0,280 Q400,310 800,280 Q1200,250 1600,280 Q1760,290 1920,280">
                <animate attributeName="strokeDasharray" values="0,2000;35,2000;0,2000" dur="4.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,8;0,0" dur="7s" repeatCount="indefinite"/>
            </path>
            <path d="M0,410 Q400,380 800,410 Q1200,440 1600,410 Q1760,400 1920,410">
                <animate attributeName="strokeDasharray" values="0,2000;45,2000;0,2000" dur="6s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="5s" repeatCount="indefinite"/>
            </path>
            <path d="M0,540 Q400,570 800,540 Q1200,510 1600,540 Q1760,550 1920,540">
                <animate attributeName="strokeDasharray" values="0,2000;30,2000;0,2000" dur="5.5s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,6;0,0" dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M0,670 Q400,640 800,670 Q1200,700 1600,670 Q1760,660 1920,670">
                <animate attributeName="strokeDasharray" values="0,2000;38,2000;0,2000" dur="4s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-7;0,0" dur="6.5s" repeatCount="indefinite"/>
            </path>
            <path d="M0,800 Q400,830 800,800 Q1200,770 1600,800 Q1760,810 1920,800">
                <animate attributeName="strokeDasharray" values="0,2000;42,2000;0,2000" dur="3.8s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,4;0,0" dur="7.5s" repeatCount="indefinite"/>
            </path>
            <path d="M0,930 Q400,900 800,930 Q1200,960 1600,930 Q1760,920 1920,930">
                <animate attributeName="strokeDasharray" values="0,2000;33,2000;0,2000" dur="5.2s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="9s" repeatCount="indefinite"/>
            </path>
        </g>
        
     
        <g fill="#0ea5e9">
            <circle r="3" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="8s" repeatCount="indefinite">
                    <path d="M0,150 Q400,120 800,150 Q1200,180 1600,150 Q1760,140 1920,150"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.3;0" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;5;3;2" dur="8s" repeatCount="indefinite"/>
            </circle>
            <circle r="2" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="6s" repeatCount="indefinite" begin="1s">
                    <path d="M0,410 Q400,380 800,410 Q1200,440 1600,410 Q1760,400 1920,410"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.4;0" dur="6s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="r" values="1;4;2;1" dur="6s" repeatCount="indefinite" begin="1s"/>
            </circle>
            <circle r="4" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="10s" repeatCount="indefinite" begin="2s">
                    <path d="M0,670 Q400,640 800,670 Q1200,700 1600,670 Q1760,660 1920,670"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.2;0" dur="10s" repeatCount="indefinite" begin="2s"/>
                <animate attributeName="r" values="3;6;4;3" dur="10s" repeatCount="indefinite" begin="2s"/>
            </circle>
            <circle r="2.5" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="7s" repeatCount="indefinite" begin="3s">
                    <path d="M0,930 Q400,900 800,930 Q1200,960 1600,930 Q1760,920 1920,930"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.5;0" dur="7s" repeatCount="indefinite" begin="3s"/>
                <animate attributeName="r" values="2;5;2.5;2" dur="7s" repeatCount="indefinite" begin="3s"/>
            </circle>
        </g>
    </g>
    
   
    <g id="right-streams">
       
        <g stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.4">
            <path d="M1900,0 Q1880,200 1900,400 Q1920,600 1900,800 Q1880,1000 1900,1080">
                <animate attributeName="strokeDasharray" values="0,100;22,100;0,100" dur="3.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.2s" repeatCount="indefinite"/>
            </path>
            <path d="M1840,0 Q1820,180 1840,360 Q1860,540 1840,720 Q1820,900 1840,1080">
                <animate attributeName="strokeDasharray" values="0,120;28,120;0,120" dur="4.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4.2s" repeatCount="indefinite"/>
            </path>
            <path d="M1780,0 Q1760,220 1780,440 Q1800,660 1780,880 Q1760,1000 1780,1080">
                <animate attributeName="strokeDasharray" values="0,110;20,110;0,110" dur="3.7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0.75;0.25" dur="3.7s" repeatCount="indefinite"/>
            </path>
        </g>
        
        <g fill="#06b6d4">
            <circle r="3" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="8s" repeatCount="indefinite" begin="4s">
                    <path d="M1920,280 Q1520,310 1120,280 Q720,250 320,280 Q160,290 0,280"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.3;0" dur="8s" repeatCount="indefinite" begin="4s"/>
                <animate attributeName="r" values="2;5;3;2" dur="8s" repeatCount="indefinite" begin="4s"/>
            </circle>
            <circle r="2.5" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="9s" repeatCount="indefinite" begin="5s">
                    <path d="M1920,540 Q1520,570 1120,540 Q720,510 320,540 Q160,550 0,540"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.4;0" dur="9s" repeatCount="indefinite" begin="5s"/>
                <animate attributeName="r" values="2;4;2.5;2" dur="9s" repeatCount="indefinite" begin="5s"/>
            </circle>
            <circle r="3.5" opacity="0.8" filter="url(#blur)">
                <animateMotion dur="7s" repeatCount="indefinite" begin="6s">
                    <path d="M1920,800 Q1520,830 1120,800 Q720,770 320,800 Q160,810 0,800"/>
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0.2;0" dur="7s" repeatCount="indefinite" begin="6s"/>
                <animate attributeName="r" values="3;6;3.5;3" dur="7s" repeatCount="indefinite" begin="6s"/>
            </circle>
        </g>
        
            <g fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.3">
            <polygon points="1750,200 1780,185 1810,200 1810,230 1780,245 1750,230">
                <animateTransform attributeName="transform" type="rotate" values="0 1780 215;360 1780 215" dur="20s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;30,20;0,0" dur="12s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="strokeOpacity" values="0.2;0.6;0.2" dur="8s" repeatCount="indefinite"/>
            </polygon>
            <polygon points="1680,450 1710,435 1740,450 1740,480 1710,495 1680,480">
                <animateTransform attributeName="transform" type="rotate" values="0 1710 465;-360 1710 465" dur="25s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;-20,15;0,0" dur="10s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="6s" repeatCount="indefinite"/>
            </polygon>
            <polygon points="1800,700 1830,685 1860,700 1860,730 1830,745 1800,730">
                <animateTransform attributeName="transform" type="rotate" values="0 1830 715;360 1830 715" dur="18s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="translate" values="0,0;25,-10;0,0" dur="14s" repeatCount="indefinite" additive="sum"/>
                <animate attributeName="strokeOpacity" values="0.1;0.5;0.1" dur="10s" repeatCount="indefinite"/>
            </polygon>
        </g>
    </g>
    
    <g fill="none" stroke="#0891b2" strokeWidth="2" opacity="0.4">
        <polygon points="400,300 430,285 460,300 460,330 430,345 400,330">
            <animateTransform attributeName="transform" type="rotate" values="0 430 315;360 430 315" dur="22s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0.2;0.7;0.2" dur="12s" repeatCount="indefinite"/>
        </polygon>
        <polygon points="800,500 830,485 860,500 860,530 830,545 800,530">
            <animateTransform attributeName="transform" type="rotate" values="0 830 515;-360 830 515" dur="28s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0.3;0.9;0.3" dur="15s" repeatCount="indefinite"/>
        </polygon>
        <polygon points="1200,350 1230,335 1260,350 1260,380 1230,395 1200,380">
            <animateTransform attributeName="transform" type="rotate" values="0 1230 365;360 1230 365" dur="24s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0.25;0.8;0.25" dur="18s" repeatCount="indefinite"/>
        </polygon>
        <polygon points="600,750 630,735 660,750 660,780 630,795 600,780">
            <animateTransform attributeName="transform" type="rotate" values="0 630 765;-360 630 765" dur="26s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0.15;0.6;0.15" dur="20s" repeatCount="indefinite"/>
        </polygon>
    </g>
    
    <g fill="url(#particleGlow)">
        <circle cx="200" cy="200" r="8" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;40,30;0,0" dur="15s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1600" cy="400" r="10" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="7s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;-50,20;0,0" dur="18s" repeatCount="indefinite"/>
        </circle>
        <circle cx="400" cy="800" r="6" opacity="0.25">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="6s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;30,-25;0,0" dur="12s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1400" cy="900" r="9" opacity="0.35">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="8s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;-35,15;0,0" dur="16s" repeatCount="indefinite"/>
        </circle>
    </g>
</svg>
    </div>
  );
}

export default DataFlow; 