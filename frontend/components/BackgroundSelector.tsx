import React from 'react';
import BrandMatrix from './BrandMatrix';
import CircuitBoard from './CircuitBoard';
import DataFlow from './DataFlow';
import GeometricParticles from './GeometricParticles';
import NeuralNetwork from './NeuralNetwork';

interface BackgroundSelectorProps {
  seed?: string; // Optional seed to ensure consistent background for same pages
}

const backgrounds = [
  BrandMatrix,
  CircuitBoard,
  DataFlow,
  GeometricParticles,
  NeuralNetwork
];

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ seed }) => {
  // If seed is provided, use it to consistently select the same background
  // Otherwise, randomly select a background each time
  const getBackgroundIndex = () => {
    if (seed) {
      // Create a simple hash from the seed string
      const hash = seed.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
      }, 0);
      // Use absolute value of hash modulo number of backgrounds
      return Math.abs(hash) % backgrounds.length;
    }
    // Random selection if no seed provided
    return Math.floor(Math.random() * backgrounds.length);
  };

  const SelectedBackground = backgrounds[getBackgroundIndex()];
  return <SelectedBackground />;
};

export default BackgroundSelector; 