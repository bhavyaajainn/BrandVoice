import React from 'react';
import BackgroundSelector from '../../components/BackgroundSelector';

const ArticlesPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <BackgroundSelector seed="articles" />
      {/* Your articles page content here */}
      <div className="relative z-10">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default ArticlesPage; 