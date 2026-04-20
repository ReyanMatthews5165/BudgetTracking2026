import { useEffect } from 'react';

/**
 * Custom Performance Monitoring Hook
 * Developed by: Backend & Performance Specialist
 * Purpose: Tracks component mount speed to ensure < 2s NFR compliance.
 */
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      // Log performance data for Sprint 3 Audit
      console.log(`[Perf Audit] ${componentName} rendered in ${duration}ms`);
      
      if (parseFloat(duration) > 2000) {
        console.warn(`[Perf Warning] ${componentName} exceeded the 2s load time NFR!`);
      }
    };
  }, [componentName]);
};

export default usePerformanceMonitor;
