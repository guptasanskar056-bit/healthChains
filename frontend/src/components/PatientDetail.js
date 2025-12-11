import React, { useState, useEffect } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchPatientData function
  // This should fetch both patient details and their records
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Fetch patient data using apiService.getPatient(patientId)
        // TODO: Fetch patient records using apiService.getPatientRecords(patientId)
        // TODO: Update state with fetched data
        const patientRes = await apiService.getPatient(patientId);
        const recordsRes = await apiService.getPatientRecords(patientId);
        setPatient(patientRes?.data || patientRes);
        setRecords(Array.isArray(recordsRes) ? recordsRes : recordsRes?.data || []);
        setPatient(patientRes);
        if (Array.isArray(recordsRes)) {
        setRecords(recordsRes);
      } else if (recordsRes && Array.isArray(recordsRes.records)) {
        setRecords(recordsRes.records);
      } else {
        setRecords([]); // fallback to empty array
      }
      } catch (err) {
        setError(err.message || 'Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">Back to List</button>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">← Back to List</button>
      </div>

      <div className="patient-detail-content">
        {/* TODO: Display patient information */}
        {/* Show: name, email, dateOfBirth, gender, phone, address, walletAddress */}
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          {/* Your implementation here */
          <div className="info-grid">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>DOB:</strong> {patient.dateOfBirth}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Wallet:</strong> {patient.walletAddress}</p>
          </div>
        }
        </div>

        {/* TODO: Display patient records */}
        {/* Show list of medical records with: type, title, date, doctor, hospital, status */}
        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {/* Your implementation here */
          records.length === 0 ? (
            <p>No medical records found.</p>
          ) : (
            records.map((r) => (
              <div key={r.id} className="record-card">
                <h3>{r.title}</h3>
                <p><strong>Type:</strong> {r.type}</p>
                <p><strong>Date:</strong> {r.date}</p>
                <p><strong>Doctor:</strong> {r.doctor}</p>
                <p><strong>Hospital:</strong> {r.hospital}</p>
                <p><strong>Status:</strong> {r.status}</p>
                <p><strong>Blockchain Hash:</strong> {r.blockchainHash}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;


