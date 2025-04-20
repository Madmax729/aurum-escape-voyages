
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTiltNavigation = (fromPath: string, toPath: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      console.log('Device orientation not supported');
      return;
    }

    let lastBeta = 0;
    const threshold = 30; // Degree threshold for tilt detection

    const handleTilt = (event: DeviceOrientationEvent) => {
      if (event.beta === null) return;
      
      const currentBeta = event.beta;
      const tiltDifference = currentBeta - lastBeta;

      if (Math.abs(tiltDifference) > threshold) {
        if (window.location.pathname === fromPath) {
          navigate(toPath);
        }
      }

      lastBeta = currentBeta;
    };

    window.addEventListener('deviceorientation', handleTilt);

    return () => {
      window.removeEventListener('deviceorientation', handleTilt);
    };
  }, [navigate, fromPath, toPath]);
};
