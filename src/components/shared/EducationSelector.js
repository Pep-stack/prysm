'use client';

import React, { useState } from 'react';

export default function EducationSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Extract carousel preference from the first entry or default to false
  const carouselPreference = value.length > 0 && value[0].useCarousel !== undefined ? value[0].useCarousel : false;

  const handleCarouselToggle = (useCarousel) => {
    // Update all entries to include the carousel preference
    const updatedEducation = value.map(entry => ({
      ...entry,
      useCarousel
    }));
    onChange(updatedEducation);
  };

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      useCarousel: carouselPreference // Inherit current preference
    });
  };

  const handleSaveNew = () => {
    if (newEntry.institution && newEntry.degree) {
      const updatedEducation = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedEducation);
      setEditingIndex(null);
      setNewEntry({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        useCarousel: carouselPreference
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedEducation = [...value];
    updatedEducation[index] = updatedEntry;
    onChange(updatedEducation);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedEducation = value.filter((_, i) => i !== index);
    onChange(updatedEducation);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Education History:
      </label>

      {/* Display Preference Setting - only show if multiple entries exist or will exist */}
      {value.length > 1 && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
            Display Style:
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="displayStyle"
                checked={!carouselPreference}
                onChange={() => handleCarouselToggle(false)}
                style={{ margin: 0 }}
              />
              <span>List View (all entries visible)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="displayStyle"
                checked={carouselPreference}
                onChange={() => handleCarouselToggle(true)}
                style={{ margin: 0 }}
              />
              <span>Carousel View (one at a time)</span>
            </label>
          </div>
        </div>
      )}

      {/* Existing Education Entries */}
      {value.map((entry, index) => (
        <EducationEntry
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
        <EducationEntry
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
          + Add Education
        </button>
      )}
    </div>
  );
}

function EducationEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const [localEntry, setLocalEntry] = useState(entry);

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (localEntry.institution && localEntry.degree) {
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
              Institution *
            </label>
            <input
              type="text"
              value={localEntry.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              placeholder="University/School name"
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
              Degree *
            </label>
            <input
              type="text"
              value={localEntry.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              placeholder="Bachelor's, Master's, PhD, etc."
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
            Field of Study
          </label>
          <input
            type="text"
            value={localEntry.field}
            onChange={(e) => handleInputChange('field', e.target.value)}
            placeholder="Computer Science, Business, etc."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Start Date
            </label>
            <input
              type="month"
              value={localEntry.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
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
              End Date
            </label>
            <input
              type="month"
              value={localEntry.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={localEntry.current}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: localEntry.current ? '#f9fafb' : 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', gap: '6px' }}>
              <input
                type="checkbox"
                checked={localEntry.current}
                onChange={(e) => handleInputChange('current', e.target.checked)}
              />
              Current
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your studies, achievements, etc."
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
            disabled={!localEntry.institution || !localEntry.degree}
            style={{
              padding: '8px 16px',
              backgroundColor: localEntry.institution && localEntry.degree ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: localEntry.institution && localEntry.degree ? 'pointer' : 'not-allowed'
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
            {entry.degree}{entry.field ? ` in ${entry.field}` : ''}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            {entry.institution}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
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

      {(entry.startDate || entry.endDate) && (
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
          {entry.startDate && new Date(entry.startDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {entry.startDate && (entry.endDate || entry.current) && ' - '}
          {entry.current ? 'Present' : (entry.endDate && new Date(entry.endDate + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}
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