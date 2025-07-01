import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Threats = () => {
  const [threatsData, setThreatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24);
  const [threats, setThreats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const loadThreatsData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getThreatsList();
      setThreats(data.threats || []);
      setTotalCount(data.total_count || 0);
    } catch (error) {
      console.error('Failed to load threats:', error);
      setError('Failed to load threats data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreatsData();
    const interval = setInterval(loadThreatsData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading threats data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Threats</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button onClick={loadThreatsData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Threat Intelligence</h1>
        <p className="text-gray-400">Monitor threat indicators and malware activity</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[1, 6, 24, 48, 72].map((hours) => (
            <button
              key={hours}
              onClick={() => setTimeRange(hours)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === hours
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>

      {/* Threat Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🦠</span>
            <span className="text-lg font-semibold">Active Indicators</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {threatsData?.summary?.active_indicators || 0}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔍</span>
            <span className="text-lg font-semibold">Detected</span>
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {threatsData?.summary?.detected_24h || 0}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-lg font-semibold">High Risk</span>
          </div>
          <div className="text-3xl font-bold text-red-500">
            {threatsData?.summary?.high_risk || 0}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-lg font-semibold">Blocked</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {threatsData?.summary?.blocked || 0}
          </div>
        </div>
      </div>

      {/* Threat Distribution Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-4">Threat Types</div>
          <div className="space-y-3">
            {threatsData?.threat_types ? (
              Object.entries(threatsData.threat_types).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">{type}</span>
                  </div>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No threat type data available</div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-4">Confidence Levels</div>
          <div className="space-y-3">
            {threatsData?.confidence_levels ? (
              Object.entries(threatsData.confidence_levels).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'High' ? 'bg-red-500' :
                      level === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm">{level}</span>
                  </div>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No confidence data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Threat Indicators */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <div className="font-semibold text-lg mb-4">Top Threat Indicators</div>
        <div className="space-y-4">
          {threatsData?.top_indicators?.length > 0 ? (
            threatsData.top_indicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base text-red-400">
                    {indicator.value}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Type: {indicator.type} | Source: {indicator.source}
                  </div>
                  <div className="text-xs text-gray-500">
                    Confidence: {indicator.confidence}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{indicator.hits}</div>
                  <div className="text-xs text-gray-400">hits</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No threat indicators available
            </div>
          )}
        </div>
      </div>

      {/* Recent Threat Activity */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="font-semibold text-lg mb-4">Recent Threat Activity</div>
        <div className="space-y-4">
          {threatsData?.recent_activity?.length > 0 ? (
            threatsData.recent_activity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base">
                    {activity.threat_type}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Agent: {activity.agent_id}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.minutes_ago} minutes ago
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary">Investigate</button>
                  <button className="btn btn-ghost">Block</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No recent threat activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Threats;