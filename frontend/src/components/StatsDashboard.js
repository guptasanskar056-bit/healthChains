import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../services/apiService';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchStats function
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call apiService.getStats()
        // TODO: Update stats state
        const res = await apiService.getStats();
        setStats(res);
      } catch (err) {
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">Error loading statistics: {error || 'No data available'}</div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-container">
      <h2>Platform Statistics</h2>
      
      {/* TODO: Display statistics in a nice grid layout */}
      {/* Show: totalPatients, totalRecords, totalConsents, activeConsents, pendingConsents, totalTransactions */}
      <div className="stats-grid">
        {/* Your implementation here */}
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>

        <div className="stat-card">
          <h3>Total Records</h3>
          <p>{stats.totalRecords}</p>
        </div>

        <div className="stat-card">
          <h3>Total Consents</h3>
          <p>{stats.totalConsents}</p>
        </div>

        <div className="stat-card">
          <h3>Active Consents</h3>
          <p>{stats.activeConsents}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Consents</h3>
          <p>{stats.pendingConsents}</p>
        </div>

        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>{stats.totalTransactions}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;


