import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { optimizedBookingService } from '@/lib/optimizedBookingService';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    cacheHitRate: 0,
    cacheSize: 0,
    maxCacheSize: 100,
    totalQueries: 0,
    cachedQueries: 0,
    averageResponseTime: 0,
    lastUpdated: new Date()
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const updateMetrics = () => {
    const cacheStats = optimizedBookingService.getCacheStats();
    const hitRate = cacheStats.size > 0 ? (cacheStats.hitRate || 0) : 0;
    
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: hitRate,
      cacheSize: cacheStats.size,
      maxCacheSize: cacheStats.maxSize,
      lastUpdated: new Date()
    }));
  };

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const clearCache = () => {
    optimizedBookingService.clearCache();
    updateMetrics();
  };

  const getPerformanceColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (value, threshold) => {
    if (value >= threshold) return <TrendingUp className="w-4 h-4" />;
    if (value >= threshold * 0.7) return <Activity className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updateMetrics}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
            >
              Clear Cache
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cache Hit Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Cache Hit Rate</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.cacheHitRate, 80)}`}>
              {metrics.cacheHitRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1">
              {getPerformanceIcon(metrics.cacheHitRate, 80)}
              <span className="text-xs text-gray-500">
                {metrics.cacheHitRate >= 80 ? 'Excellent' : 
                 metrics.cacheHitRate >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Cache Usage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Cache Usage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.cacheSize}/{metrics.maxCacheSize}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(metrics.cacheSize / metrics.maxCacheSize) * 100}%` }}
              />
            </div>
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Avg Response</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.averageResponseTime, 100)}`}>
              {metrics.averageResponseTime.toFixed(0)}ms
            </div>
            <div className="flex items-center gap-1">
              {getPerformanceIcon(metrics.averageResponseTime, 100)}
              <span className="text-xs text-gray-500">
                {metrics.averageResponseTime <= 100 ? 'Fast' : 
                 metrics.averageResponseTime <= 500 ? 'Moderate' : 'Slow'}
              </span>
            </div>
          </div>

          {/* Total Queries */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Total Queries</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.totalQueries}
            </div>
            <div className="text-xs text-gray-500">
              {metrics.cachedQueries} cached
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Performance Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {metrics.cacheHitRate < 60 && (
              <li>• Cache hit rate is low. Consider increasing cache TTL or optimizing queries.</li>
            )}
            {metrics.cacheSize > metrics.maxCacheSize * 0.8 && (
              <li>• Cache is nearly full. Consider increasing cache size or implementing LRU eviction.</li>
            )}
            {metrics.averageResponseTime > 500 && (
              <li>• Response times are slow. Consider optimizing database queries or adding indexes.</li>
            )}
            {metrics.cacheHitRate >= 80 && metrics.averageResponseTime <= 100 && (
              <li>• Performance is excellent! Your caching strategy is working well.</li>
            )}
          </ul>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {metrics.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;

