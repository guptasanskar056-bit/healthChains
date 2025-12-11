import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchTransactions function
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call apiService.getTransactions with account address if available
        // TODO: Update transactions state 
        const res = await apiService.getTransactions(account || null, 20);
        let txList = Array.isArray(res.transactions) ? res.transactions : [];
        if (window.latestConsentTx) {
        txList = [window.latestConsentTx, ...txList];
      }
        setTransactions(txList);
      } catch (err) {
        console.error("Transaction fetch error:", err);
        setError(err.message || 'Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    // TODO: Format the timestamp to a readable date
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            Filtering for: {formatAddress(account)}
          </div>
        )}
      </div>

      {/* TODO: Display transactions list */}
      {/* Show: type, from, to, amount, currency, status, timestamp, blockchainTxHash */}
      <div className="transactions-list">
        {/* Your implementation here */
        transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              <h3>{tx.type}</h3>
              <p><strong>From:</strong> {formatAddress(tx.from)}</p>
              <p><strong>To:</strong> {formatAddress(tx.to)}</p>
              <p><strong>Amount:</strong> {tx.amount} {tx.currency}</p>
              <p><strong>Status:</strong> {tx.status}</p>
              <p><strong>Date:</strong> {formatDate(tx.timestamp)}</p>
              <p><strong>Tx Hash:</strong> {tx.blockchainTxHash}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;


