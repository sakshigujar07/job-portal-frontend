import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../Navbar';
import {
  ACCENT,
  TEXT_MUTED,
  cardStyle,
  pageHeading,
  inputStyle,
  buttonStyle,
  errorMsgStyle,
} from '../theme';

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logoUrl: '',
  });

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/companies/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
      setFormData({
        name: res.data.name || '',
        description: res.data.description || '',
        website: res.data.website || '',
        location: res.data.location || '',
        logoUrl: res.data.logoUrl || '',
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No company yet - show create form
        setCompany(null);
        setIsEditing(true);
      } else if (err.response && err.response.status === 403) {
        setError('Access denied (403). Please log in again and make sure this is an employer account.');
      } else {
        setError('Could not load company details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Company name is required.');
      return;
    }

    setSaving(true);
    try {
      if (company && company.id) {
        // Update existing
        const res = await api.put(`/companies/${company.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
      } else {
        // Create new
        const res = await api.post('/companies', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
      }
      setIsEditing(false);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('This employer already has a company, or the input is not valid.');
      } else if (err.response && err.response.status === 403) {
        setError('Access denied (403). Please log in again and make sure this is an employer account.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong while saving. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        location: company.location || '',
        logoUrl: company.logoUrl || '',
      });
      setIsEditing(false);
      setError('');
    } else {
      // No company exists yet - cancel goes back to dashboard
      navigate('/dashboard');
    }
  };

  const secondaryButtonStyle = {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: `1px solid ${ACCENT}`,
    background: '#fff',
    color: ACCENT,
    cursor: 'pointer',
  };

  const fieldLabel = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  };

  const fieldGroup = { marginBottom: '14px' };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p style={{ color: TEXT_MUTED, textAlign: 'center', marginTop: '30px' }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 15px' }}>
        <h1 style={pageHeading}>
          {company ? 'Company Profile' : 'Create Your Company'}
        </h1>

        {error && <p style={errorMsgStyle}>{error}</p>}

        {!isEditing && company ? (
          <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
            {company.logoUrl && (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                style={{ maxWidth: '120px', marginBottom: '14px' }}
              />
            )}
            <h2 style={{ margin: '0 0 8px 0', color: '#111' }}>{company.name}</h2>
            {company.location && (
              <p style={{ color: TEXT_MUTED, margin: '4px 0' }}>📍 {company.location}</p>
            )}
            {company.website && (
              <p style={{ margin: '4px 0' }}>
                🔗{' '}
                <a href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              </p>
            )}
            {company.description && (
              <p style={{ marginTop: '12px', whiteSpace: 'pre-wrap', color: TEXT_MUTED }}>
                {company.description}
              </p>
            )}
            <button
              onClick={() => setIsEditing(true)}
              style={{ ...secondaryButtonStyle, marginTop: '16px' }}
            >
              Edit Company
            </button>
          </div>
        ) : (
          <div style={{ ...cardStyle, marginTop: '16px' }}>
            <form onSubmit={handleSubmit}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div style={fieldGroup}>
                <label style={fieldLabel}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div style={fieldGroup}>
                <label style={fieldLabel}>Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div style={fieldGroup}>
                <label style={fieldLabel}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div style={fieldGroup}>
                <label style={fieldLabel}>Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={saving} style={buttonStyle}>
                  {saving ? 'Saving...' : company ? 'Update' : 'Create Company'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  style={{ ...secondaryButtonStyle, borderColor: '#ccc', color: '#555' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}