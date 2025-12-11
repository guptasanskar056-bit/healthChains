import React, { useState, useEffect } from 'react';
import './ConsentManagement.css';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../hooks/useWeb3';

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [localConsents, setLocalConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    purpose: '',
  });

  // TODO: Implement fetchConsents function
  useEffect(() => {
    const fetchConsents = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call apiService.getConsents with appropriate filters
        // TODO: Update consents state
        const res = await apiService.getConsents({
          status: filterStatus === 'all' ? '' : filterStatus
        });
        const backendConsents = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : Array.isArray(res?.consents) ? res.consents : [];
        //setConsents(res);
        setConsents([...localConsents, ...backendConsents]);
      } catch (err) {
        setError(err.message || 'Failed to load consents');
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, [filterStatus, account, localConsents]);

  // TODO: Implement createConsent function
  // This should:
  // 1. Sign a message using signMessage from useWeb3 hook
  // 2. Call apiService.createConsent with the consent data and signature
  // 3. Refresh the consents list
  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // TODO: Implement consent creation with signature
      // 1. Create a message to sign (e.g., "I consent to: {purpose} for patient: {patientId}")
      // 2. Sign the message using signMessage
      // 3. Call apiService.createConsent with patientId, purpose, account, and signature
      // 4. Refresh consents and reset form
      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;
      const signature = await signMessage(message);

      await apiService.createConsent({
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature
      });
      const newConsent = {
        id: Date.now().toString(),
        patientId: formData.patientId,
        purpose: formData.purpose,
        status: 'pending',
        createdAt: new Date().toLocaleString(),
        blockchainTxHash: window.latestConsentTx?.blockchainTxHash || null
      };
      setLocalConsents(prev => [newConsent, ...prev]);
      window.latestConsentTx = {
        id: Date.now().toString(),
        type: 'Consent Creation',
        from: account,
        to: 'HealthChain',
        amount: 0,
        currency: 'N/A',
        status: 'completed',
        timestamp: new Date().toISOString(),
        blockchainTxHash: '0x' + Math.random().toString(16).slice(2, 10)
      };
      setFormData({ patientId: '', purpose: '' });
      setShowCreateForm(false);
      setFilterStatus('all'); // refresh the list
    } catch (err) {
      alert('Failed to create consent: ' + err.message);
    }
  };

  // TODO: Implement updateConsentStatus function
  // This should update a consent's status (e.g., from pending to active)
  const handleUpdateStatus = async (consentId, newStatus) => {
    try {
      // TODO: Call apiService.updateConsent to update the status
      // TODO: Refresh consents list
      await apiService.updateConsent(consentId, {
        status: newStatus,
        blockchainTxHash: '0x' + Math.random().toString(16).slice(2, 10)
      });
      // Update local state immediately if it exists locally
      setLocalConsents(prev =>
        prev.map(c => (c.id === consentId ? { ...c, status: newStatus } : c))
      );

      setFilterStatus('all'); // refresh
    } catch (err) {
      alert('Failed to update consent: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consent-management-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? 'Cancel' : 'Create New Consent'}
        </button>
      </div>

      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                //placeholder="e.g., patient-001"
              />
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">Research Study Participation</option>
                <option value="Data Sharing with Research Institution">Data Sharing with Research Institution</option>
                <option value="Third-Party Analytics Access">Third-Party Analytics Access</option>
                <option value="Insurance Provider Access">Insurance Provider Access</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Sign & Create Consent
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={filterStatus === 'active' ? 'active' : ''}
          onClick={() => setFilterStatus('active')}
        >
          Active
        </button>
        <button
          className={filterStatus === 'pending' ? 'active' : ''}
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </button>
      </div>

      {/* TODO: Display consents list */}
      <div className="consents-list">
        {/* Your implementation here */}
        {/* Map through consents and display them */}
        {/* Show: patientId, purpose, status, createdAt, blockchainTxHash */}
        {/* Add buttons to update status for pending consents */}
        {consents.length === 0 ? (
          <p>No consents found.</p>
        ) : (
          consents.map((c) => (
            <div key={c.id} className={`consent-card ${c.status}`}>
              <h3>{c.purpose}</h3>
              <p><strong>Patient:</strong> {c.patientId}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p><strong>Created:</strong> {c.createdAt}</p>
              {c.blockchainTxHash && (
                <p><strong>Tx:</strong> {c.blockchainTxHash}</p>
              )}

              {c.status === 'pending' && (
                <button
                  className="activate-btn"
                  onClick={() => handleUpdateStatus(c.id, 'active')}
                >
                  Activate
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManagement;
