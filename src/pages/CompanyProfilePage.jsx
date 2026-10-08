import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
        setError('Access नाकारला (403). Login परत करून बघा, किंवा हे employer account आहे का ते तपासा.');
      } else {
        setError('Company details load करताना error आला. परत प्रयत्न करा.');
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
      setError('Company name आवश्यक आहे.');
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
        setError('या employer साठी company आधीच existing आहे किंवा input चुकीचं आहे.');
      } else if (err.response && err.response.status === 403) {
        setError('Access नाकारला (403). Login परत करून बघा, किंवा हे employer account आहे का ते तपासा.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Save करताना काहीतरी चुकलं. परत प्रयत्न करा.');
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

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px 20px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        {company ? 'Company Profile' : 'Create Your Company'}
      </h2>

      {error && (
        <div
          style={{
            background: '#fdecea',
            color: '#b71c1c',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {!isEditing && company ? (
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              style={{ maxWidth: '120px', marginBottom: '14px' }}
            />
          )}
          <h3 style={{ margin: '0 0 8px 0' }}>{company.name}</h3>
          {company.location && (
            <p style={{ color: '#555', margin: '4px 0' }}>📍 {company.location}</p>
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
            <p style={{ marginTop: '12px', whiteSpace: 'pre-wrap' }}>
              {company.description}
            </p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Edit Company
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Logo URL
            </label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={saving} style={{ padding: '8px 16px' }}>
              {saving ? 'Saving...' : company ? 'Update' : 'Create Company'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}