import React, { useEffect, useState } from 'react';
import { performanceMonitoring } from '@/lib/performanceOptimizations';

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    userInteractions: 0
  });

  useEffect(() => {
    if (!enabled) return;

    // Monitor performance metrics
    const updateMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: performance.memory ? 
          Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0
      }));
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    // Monitor page load performance
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
      }));
    }

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Render: {metrics.renderTime}ms</div>
        <div>Requests: {metrics.networkRequests}</div>
        <div>Interactions: {metrics.userInteractions}</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;