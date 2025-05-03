import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  // Initialize state based on window object availability
  const [isMobile, setIsMobile] = useState(() => {
      if (typeof window !== 'undefined') {
          return window.innerWidth < breakpoint;
      }
      return false; // Default value for server-side rendering
  });

  useEffect(() => {
    // Only run this effect client-side
    if (typeof window === 'undefined') {
      return;
    }

    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener('resize', checkSize);

    // Initial check in case the component mounts after initial load
    checkSize();

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]); // Re-run effect if breakpoint changes

  return isMobile;
};

export default useIsMobile; 