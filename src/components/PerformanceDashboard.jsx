import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye,
  RefreshCw,
  TrendingUp,
  Zap
} from 'lucide-react';
import { performanceMonitor } from '@/lib/performanceMonitoring';
import { bundleMonitor } from '@/lib/bundleMonitoring';

const PerformanceDashboard = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState({});
  const [bundleData, setBundleData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPerformanceData();
    }
  }, [isOpen]);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    try {
      const performanceData = performanceMonitor.getPerformanceSummary();
      const bundleData = bundleMonitor.getBundleReport();
      
      setMetrics(performanceData);
      setBundleData(bundleData);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricStatus = (value, threshold) => {
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadPerformanceData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.coreWebVitals && Object.entries(metrics.coreWebVitals).map(([metric, data]) => {
                  const status = getMetricStatus(data.value, data.threshold);
                  return (
                    <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium text-gray-900">{metric}</div>
                          <div className="text-sm text-gray-500">
                            {Math.round(data.value)}ms
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Bundle Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Bundle Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bundleData.current && Object.entries(bundleData.current).map(([category, size]) => {
                  const budget = bundleData.budgets[category];
                  const status = getMetricStatus(size, budget);
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{category}</div>
                          <div className="text-sm text-gray-500">
                            {size}KB / {budget}KB
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Performance Issues */}
            {metrics.issues && metrics.issues.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Performance Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-medium text-red-900">{issue.metric}</div>
                        <div className="text-sm text-red-700">
                          {issue.value}ms exceeds threshold of {issue.threshold}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bundle Recommendations */}
            {bundleData.recommendations && bundleData.recommendations.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <TrendingUp className="w-5 h-5" />
                    Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bundleData.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm text-yellow-800">{rec}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.coreWebVitals ? Object.keys(metrics.coreWebVitals).length : 0}
                    </div>
                    <div className="text-sm text-gray-500">Metrics Tracked</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.issues ? metrics.issues.length : 0}
                    </div>
                    <div className="text-sm text-gray-500">Issues Found</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {bundleData.recommendations ? bundleData.recommendations.length : 0}
                    </div>
                    <div className="text-sm text-gray-500">Recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
