import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Clock, 
  Target,
  RefreshCw,
  Download,
  Eye,
  TestTube
} from 'lucide-react';
import { userAnalytics } from '@/lib/userAnalytics';
import { conversionFunnel } from '@/lib/conversionFunnel';
import { abTesting } from '@/lib/abTesting';

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [funnelData, setFunnelData] = useState({});
  const [abTestData, setAbTestData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData();
    }
  }, [isOpen]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const analytics = userAnalytics.getAnalyticsSummary();
      const funnel = conversionFunnel.getFunnelAnalysis();
      const abTests = abTesting.getAllExperiments();
      
      setAnalyticsData(analytics);
      setFunnelData(funnel);
      setAbTestData(abTests);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const exportData = {
      analytics: analyticsData,
      funnel: funnelData,
      abTests: abTestData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'funnel', name: 'Conversion Funnel', icon: Target },
    { id: 'abtesting', name: 'A/B Testing', icon: TestTube }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
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
                onClick={loadAnalyticsData}
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

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Session Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Session Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Duration</span>
                    <span className="font-medium">
                      {Math.round(analyticsData.session?.sessionDuration / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-medium">{analyticsData.session?.pageViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events</span>
                    <span className="font-medium">{analyticsData.session?.events}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Journey Steps</span>
                    <span className="font-medium">{analyticsData.session?.userJourney}</span>
                  </div>
                </CardContent>
              </Card>

              {/* User Journey */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    User Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyticsData.journey?.eventTypes && Object.entries(analyticsData.journey.eventTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Time on Page</span>
                      <span className="font-medium">
                        {Math.round(analyticsData.performance?.averageTimeOnPage / 1000)}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Funnel Steps</span>
                      <span className="font-medium">{analyticsData.funnel?.steps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Steps</span>
                      <span className="font-medium">{analyticsData.funnel?.completedSteps}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div className="space-y-6">
              {/* Funnel Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {funnelData.overallConversionRate?.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">Overall Conversion</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {funnelData.steps?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Total Steps</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {funnelData.dropOffPoints?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Drop-off Points</div>
                    </div>
                  </div>

                  {/* Funnel Steps */}
                  <div className="space-y-3">
                    {funnelData.steps?.map((step, index) => (
                      <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{step.name}</div>
                            <div className="text-sm text-gray-500">{step.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{step.count}</div>
                          <div className="text-sm text-gray-500">{step.conversionRate?.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {funnelData.recommendations?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {funnelData.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-sm text-yellow-800">{rec.suggestion}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'abtesting' && (
            <div className="space-y-6">
              {/* A/B Tests Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    A/B Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {abTestData.filter(test => test.status === 'active').length}
                      </div>
                      <div className="text-sm text-gray-500">Active Tests</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {abTestData.length}
                      </div>
                      <div className="text-sm text-gray-500">Total Tests</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {abTestData.filter(test => test.status === 'ended').length}
                      </div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                  </div>

                  {/* Test List */}
                  <div className="space-y-3">
                    {abTestData.map(test => (
                      <div key={test.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{test.name}</div>
                          <Badge className={test.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {test.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">{test.description}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Variants: {test.variants.length}</span>
                          <span>Duration: {Math.round((Date.now() - test.startDate) / (24 * 60 * 60 * 1000))} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
