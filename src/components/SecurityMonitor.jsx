/**
 * Security Monitor Component
 * Displays security status and monitoring information
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Lock, Unlock, Clock, Activity, Eye, EyeOff, Key } from 'lucide-react';
import useSecurityStore from '@/stores/securityStore';

const SecurityMonitor = () => {
  const securityStore = useSecurityStore();
  const [securityStatus, setSecurityStatus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setSecurityStatus(securityStore.getSecurityStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [securityStore]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const recentEvents = securityStore.securityEvents.slice(0, 10);
  const lockedAccounts = Array.from(securityStore.lockedAccounts.entries());
  const failedLogins = securityStore.failedLogins.slice(-10);
  const csrfStats = securityStore.csrfStats || securityStore.getCSRFStats();

  if (!securityStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{securityStatus.activeLocks}</div>
              <div className="text-sm text-gray-600">Active Locks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{securityStatus.recentFailures}</div>
              <div className="text-sm text-gray-600">Recent Failures</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{securityStatus.securityEvents}</div>
              <div className="text-sm text-gray-600">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {securityStatus.isSessionExpired ? 'Expired' : 'Active'}
              </div>
              <div className="text-sm text-gray-600">Session Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{csrfStats?.activeTokens || 0}</div>
              <div className="text-sm text-gray-600">CSRF Tokens</div>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Session Information</h4>
                  <div className="space-y-1 text-sm">
                    <div>Last Activity: {formatTime(securityStatus.lastActivity)}</div>
                    <div>Session Status: 
                      <Badge variant={securityStatus.isSessionExpired ? 'destructive' : 'default'} className="ml-2">
                        {securityStatus.isSessionExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Rate Limiting</h4>
                  <div className="space-y-1 text-sm">
                    <div>Max Attempts: {securityStore.rateLimitConfig.maxAttempts}</div>
                    <div>Window: {formatDuration(securityStore.rateLimitConfig.windowMs)}</div>
                    <div>Lockout: {formatDuration(securityStore.rateLimitConfig.lockoutDuration)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">CSRF Protection</h4>
                  <div className="space-y-1 text-sm">
                    <div>Active Tokens: {csrfStats?.activeTokens || 0}</div>
                    <div>Total Tokens: {csrfStats?.totalTokens || 0}</div>
                    <div>Sessions: {csrfStats?.sessionCount || 0}</div>
                    <div>Used Tokens: {csrfStats?.usedTokens || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Locks */}
      {lockedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Lock className="h-5 w-5" />
              Active Account Locks ({lockedAccounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lockedAccounts.map(([identifier, lockInfo]) => (
                <div key={identifier} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">{identifier}</div>
                    <div className="text-sm text-gray-600">
                      Locked until: {formatTime(lockInfo.until)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Locked</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => securityStore.unlockAccount(identifier)}
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Unlock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Security Events ({recentEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEvents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No recent security events
              </div>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <div>
                      <div className="font-medium">{event.type}</div>
                      <div className="text-sm text-gray-600">
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {event.data?.identifier || event.data?.reason || 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Failed Logins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recent Failed Logins ({failedLogins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {failedLogins.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No recent failed login attempts
              </div>
            ) : (
              failedLogins.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium">{login.identifier}</div>
                    <div className="text-sm text-gray-600">
                      {formatTime(login.timestamp)} - {login.reason}
                    </div>
                  </div>
                  <Badge variant="secondary">{login.reason}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => securityStore.clearSecurityEvents()}
            >
              Clear Events
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Unlock all accounts
                lockedAccounts.forEach(([identifier]) => {
                  securityStore.unlockAccount(identifier);
                });
              }}
            >
              Unlock All Accounts
            </Button>
            <Button
              variant="outline"
              onClick={() => securityStore.cleanup()}
            >
              Cleanup Expired Data
            </Button>
            <Button
              variant="outline"
              onClick={() => securityStore.clearCSRFTokens()}
            >
              Clear CSRF Tokens
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
