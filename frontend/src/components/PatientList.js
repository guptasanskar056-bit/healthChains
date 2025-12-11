import React, { useState, useEffect, useCallback } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // TODO: Implement the fetchPatients function
  // This function should:
  // 1. Call apiService.getPatients with appropriate parameters (page, limit, search)
  // 2. Update the patients state with the response data
  // 3. Update the pagination state
  // 4. Handle loading and error states
  const fetchPatients = useCallback(async () => {
    // Your implementation here
    setLoading(true);
    setError(null);
    try {
      // TODO: Call API and update state
      const res = await apiService.getPatients(currentPage, 10, searchTerm);
      console.log("Patients API response:", res);
      // Safe extraction
      const patientList = Array.isArray(res.patients) ? res.patients : [];
      const pageInfo = res.pagination || { page: currentPage, totalPages: 1 };
      setPatients(patientList);
      setPagination(pageInfo);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
      setPatients([]); // ensure patients is always an array
      setPagination({ page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(fetchPatients, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchPatients]);

  // TODO: Implement search functionality
  // Add a debounce or handle search input changes
  const handleSearch = (e) => {
    // Your implementation here
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to page 1 on search
  };

  if (loading) {
    return (
      <div className="patient-list-container">
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        {/* TODO: Add search input field */}
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          // TODO: Add value, onChange handlers
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* TODO: Implement patient list display */}
      {/* Map through patients and display them */}
      {/* Each patient should be clickable and call onSelectPatient with patient.id */}
      <div className="patient-list">
        {/* Your implementation here */
        patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          patients.map((p) => (
            <div
              key={p.id}
              className="patient-card"
              onClick={() => onSelectPatient(p.id)}
            >
              <h3>{p.name}</h3>
              <p>{p.email}</p>
              <p><strong>DOB:</strong> {p.dateOfBirth}</p>
            </div>
          ))
        )}
      </div>

      {/* TODO: Implement pagination controls */}
      {/* Show pagination buttons if pagination data is available */}
      {pagination && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((c) => c - 1)}
          >
            Prev
          </button>

          <span>
            Page {pagination.page} / {pagination.totalPages}
          </span>

          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage((c) => c + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;


