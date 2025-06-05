'use client';

import React, { useState } from 'react';

export default function CertificationSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    organization: '',
    date: '',
    credentialId: '',
    url: '',
    description: ''
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      name: '',
      organization: '',
      date: '',
      credentialId: '',
      url: '',
      description: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.name && newEntry.organization) {
      const updatedCertifications = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedCertifications);
      setEditingIndex(null);
      setNewEntry({
        name: '',
        organization: '',
        date: '',
        credentialId: '',
        url: '',
        description: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedCertifications = [...value];
    updatedCertifications[index] = updatedEntry;
    onChange(updatedCertifications);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedCertifications = value.filter((_, i) => i !== index);
    onChange(updatedCertifications);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Certifications & Licenses:
      </label>

      {/* Existing Certification Entries */}
      {value.map((entry, index) => (
        <CertificationEntry
          key={entry.id || index}
          entry={entry}
          index={index}
          isEditing={editingIndex === index}
          onEdit={() => handleEdit(index)}
          onSave={(updatedEntry) => handleSaveEdit(index, updatedEntry)}
          onDelete={() => handleDelete(index)}
          onCancel={handleCancel}
        />
      ))}

      {/* Add New Entry */}
      {editingIndex === 'new' ? (
        <CertificationEntry
          entry={newEntry}
          isEditing={true}
          isNew={true}
          onSave={handleSaveNew}
          onCancel={handleCancel}
          onChange={setNewEntry}
        />
      ) : (
        <button
          onClick={handleAddNew}
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8f9fa',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            color: '#6c757d',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s ease',
            marginTop: value.length > 0 ? '12px' : '0'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e9ecef';
            e.target.style.borderColor = '#adb5bd';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.borderColor = '#dee2e6';
          }}
        >
          + Add Certification
        </button>
      )}
    </div>
  );
}

function CertificationEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const [localEntry, setLocalEntry] = useState(entry);

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (localEntry.name && localEntry.organization) {
      onSave(localEntry);
    }
  };

  if (isEditing) {
    return (
      <div style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Certificate Name *
            </label>
            <input
              type="text"
              value={localEntry.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="AWS Solutions Architect, PMP, etc."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Issuing Organization *
            </label>
            <input
              type="text"
              value={localEntry.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder="Amazon Web Services, PMI, etc."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Issue Date
            </label>
            <input
              type="month"
              value={localEntry.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Credential ID
            </label>
            <input
              type="text"
              value={localEntry.credentialId}
              onChange={(e) => handleInputChange('credentialId', e.target.value)}
              placeholder="Optional credential ID"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Verification URL
          </label>
          <input
            type="url"
            value={localEntry.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://verify.example.com/certificate/123"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the certification..."
            rows={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '60px'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!localEntry.name || !localEntry.organization}
            style={{
              padding: '8px 16px',
              backgroundColor: localEntry.name && localEntry.organization ? '#059669' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: localEntry.name && localEntry.organization ? 'pointer' : 'not-allowed'
            }}
          >
            {isNew ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      marginBottom: '12px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {entry.name}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
            {entry.organization}
          </p>
          {entry.credentialId && (
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>
              ID: {entry.credentialId}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 12px',
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '4px',
                fontSize: '12px',
                textDecoration: 'none',
                color: '#1d4ed8'
              }}
            >
              Verify
            </a>
          )}
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#dc2626'
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {entry.date && (
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
          Issued: {entry.date.length === 4 ? entry.date : new Date(entry.date + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      )}

      {entry.description && (
        <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
          {entry.description}
        </p>
      )}
    </div>
  );
} 