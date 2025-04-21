
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTiltNavigation = (fromPath: string, toPath: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      console.log('Device orientation not supported');
      return;
    }

    let lastGamma = 0;
    let lastBeta = 0;
    const threshold = 25; // Degree threshold for tilt detection
    let hasNavigated = false;
    let isActive = true;

    // Show a toast notification to inform the user about tilt navigation
    toast.info('Tilt your device to navigate', {
      duration: 3000,
      position: 'bottom-center',
    });

    const handleTilt = (event: DeviceOrientationEvent) => {
      if (!isActive || hasNavigated) return;
      if (event.beta === null || event.gamma === null) return;
      
      // Only proceed if we're on the fromPath
      if (window.location.pathname !== fromPath) return;

      const currentBeta = Math.round(event.beta);
      const currentGamma = Math.round(event.gamma);
      
      // Calculate the absolute differences
      const betaDiff = Math.abs(currentBeta - lastBeta);
      const gammaDiff = Math.abs(currentGamma - lastGamma);
      
      // Check if the tilt exceeds our threshold in either direction
      if (betaDiff > threshold || gammaDiff > threshold) {
        console.log(`Detected tilt: Beta diff = ${betaDiff}, Gamma diff = ${gammaDiff}`);
        
        // Set a flag to prevent multiple navigations
        hasNavigated = true;
        
        // Show a toast notification
        toast.success('Navigating to Explore page...', {
          duration: 2000,
          position: 'bottom-center',
        });
        
        // Navigate with a slight delay to allow the toast to be seen
        setTimeout(() => {
          navigate(toPath);
        }, 500);
      }

      // Update the last values
      lastBeta = currentBeta;
      lastGamma = currentGamma;
    };

    // Add a debounced event listener to reduce unnecessary processing
    let debounceTimer: number;
    const debouncedHandleTilt = (event: DeviceOrientationEvent) => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => handleTilt(event), 100);
    };

    window.addEventListener('deviceorientation', debouncedHandleTilt);

    // Reset the navigation flag if we navigate away and come back
    const resetNavigation = () => {
      hasNavigated = false;
    };
    window.addEventListener('popstate', resetNavigation);

    return () => {
      isActive = false;
      window.removeEventListener('deviceorientation', debouncedHandleTilt);
      window.removeEventListener('popstate', resetNavigation);
      clearTimeout(debounceTimer);
    };
  }, [navigate, fromPath, toPath]);
};
