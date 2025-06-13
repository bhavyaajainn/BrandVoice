import React from 'react';
import BackgroundSelector from '../../components/BackgroundSelector';

const VideosPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <BackgroundSelector seed="videos" />
      {/* Your videos page content here */}
      <div className="relative z-10">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default VideosPage; 