import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bug, 
  Activity, 
  TrendingUp, 
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { errorTracking } from '@/lib/errorTracking';

const ErrorDashboard = ({ isOpen, onClose }) => {
  const [errorData, setErrorData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadErrorData();
    }
  }, [isOpen]);

  const loadErrorData = async () => {
    setIsLoading(true);
    try {
      const analytics = errorTracking.getErrorAnalytics();
      const summary = errorTracking.getErrorSummary();
      
      setErrorData({ analytics, summary });
    } catch (error) {
      console.error('Error loading error data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const exportData = errorTracking.exportErrorData();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const filteredErrors = errorData.analytics?.recentErrors?.filter(error => {
    const matchesSeverity = filterSeverity === 'all' || error.severity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  }) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Error Dashboard</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadErrorData}
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
            {/* Error Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Error Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {errorData.summary?.totalErrors || 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Errors</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {errorData.summary?.recentErrors || 0}
                    </div>
                    <div className="text-sm text-gray-500">Recent (24h)</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical Errors</span>
                    <Badge className={getSeverityColor('critical')}>
                      {errorData.summary?.criticalErrors || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Severity</span>
                    <Badge className={getSeverityColor('high')}>
                      {errorData.summary?.highErrors || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Rate (1h)</span>
                    <span className="font-medium">{errorData.summary?.errorRate || 0}/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Error Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorData.analytics?.errorsByType?.slice(0, 5).map((errorType, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {errorType.type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {errorType.percentage.toFixed(1)}% of total
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{errorType.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(errorData.analytics?.errorsBySeverity || {}).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getSeverityIcon(severity)}</span>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{severity}</div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(severity)}>
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Error Trends (7 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(errorData.analytics?.errorTrends || {}).map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">{date}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Errors */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recent Errors
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showDetails ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search errors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Error List */}
              <div className="space-y-3">
                {filteredErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSeverityIcon(error.severity)}</span>
                        <Badge className={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                        <Badge variant="outline">
                          {error.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-gray-900 font-medium mb-2">
                      {error.message}
                    </div>
                    
                    {showDetails && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <div className="space-y-2">
                          <div>
                            <strong>URL:</strong> {error.url}
                          </div>
                          <div>
                            <strong>User Agent:</strong> {error.userAgent}
                          </div>
                          {error.stack && (
                            <div>
                              <strong>Stack Trace:</strong>
                              <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                                {error.stack}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredErrors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No errors found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ErrorDashboard;
