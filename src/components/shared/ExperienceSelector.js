'use client';

import React, { useState } from 'react';

export default function ExperienceSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    company: '',
    title: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    skills: []
  });

  // Extract carousel preference from the first entry or default to false
  const carouselPreference = value.length > 0 && value[0].useCarousel !== undefined ? value[0].useCarousel : false;

  const handleCarouselToggle = (useCarousel) => {
    // Update all entries to include the carousel preference
    const updatedExperience = value.map(entry => ({
      ...entry,
      useCarousel
    }));
    onChange(updatedExperience);
  };

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      company: '',
      title: '',
      location: '',
      type: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      skills: [],
      useCarousel: carouselPreference // Inherit current preference
    });
  };

  const handleSaveNew = () => {
    if (newEntry.company && newEntry.title) {
      const updatedExperience = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedExperience);
      setEditingIndex(null);
      setNewEntry({
        company: '',
        title: '',
        location: '',
        type: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        skills: [],
        useCarousel: carouselPreference
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedExperience = [...value];
    updatedExperience[index] = updatedEntry;
    onChange(updatedExperience);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedExperience = value.filter((_, i) => i !== index);
    onChange(updatedExperience);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Work Experience:
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

      {/* Existing Experience Entries */}
      {value.map((entry, index) => (
        <ExperienceEntry
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
        <ExperienceEntry
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
          + Add Work Experience
        </button>
      )}
    </div>
  );
}

function ExperienceEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const [localEntry, setLocalEntry] = useState(entry);
  const [skillInput, setSkillInput] = useState('');

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !localEntry.skills.includes(skillInput.trim())) {
      const updatedSkills = [...localEntry.skills, skillInput.trim()];
      handleInputChange('skills', updatedSkills);
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = localEntry.skills.filter(skill => skill !== skillToRemove);
    handleInputChange('skills', updatedSkills);
  };

  const handleSave = () => {
    if (localEntry.company && localEntry.title) {
      onSave(localEntry);
    }
  };

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
    'Temporary',
    'Volunteer'
  ];

  if (isEditing) {
    return (
      <div style={{
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              Company *
            </label>
            <input
              type="text"
              value={localEntry.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Company name"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              Job Title *
            </label>
            <input
              type="text"
              value={localEntry.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Software Engineer, Manager, etc."
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              Location
            </label>
            <input
              type="text"
              value={localEntry.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State or Remote"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              Employment Type
            </label>
            <select
              value={localEntry.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select type</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              Start Date
            </label>
            <input
              type="month"
              value={localEntry.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              End Date
            </label>
            <input
              type="month"
              value={localEntry.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={localEntry.current}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: localEntry.current ? '#f9fafb' : 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', gap: '8px', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={localEntry.current}
                onChange={(e) => handleInputChange('current', e.target.checked)}
              />
              Current Job
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
            Job Description
          </label>
          <textarea
            value={localEntry.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
            Skills & Technologies
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
              placeholder="Add a skill and press Enter"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          {localEntry.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {localEntry.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '12px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1e40af',
                      cursor: 'pointer',
                      fontSize: '14px',
                      lineHeight: 1,
                      padding: 0,
                      marginLeft: '2px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!localEntry.company || !localEntry.title}
            style={{
              padding: '10px 20px',
              backgroundColor: localEntry.company && localEntry.title ? '#059669' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: localEntry.company && localEntry.title ? 'pointer' : 'not-allowed'
            }}
          >
            {isNew ? 'Add Experience' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div style={{
      padding: '18px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: 'white',
      marginBottom: '12px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {entry.title}
          </h4>
          <p style={{ margin: 0, fontSize: '15px', color: '#374151', fontWeight: '500', marginBottom: '2px' }}>
            {entry.company}
          </p>
          {entry.location && (
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              {entry.location}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
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
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#dc2626'
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        {(entry.startDate || entry.endDate || entry.current) && (
          <span style={{
            padding: '3px 8px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            fontSize: '12px',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            {entry.startDate && new Date(entry.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            {entry.startDate && (entry.endDate || entry.current) && ' - '}
            {entry.current ? 'Present' : (entry.endDate && new Date(entry.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
          </span>
        )}
        {entry.type && (
          <span style={{
            padding: '3px 8px',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontSize: '12px',
            borderRadius: '6px',
            fontWeight: '500'
          }}>
            {entry.type}
          </span>
        )}
        {entry.current && (
          <span style={{
            padding: '3px 8px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '12px',
            borderRadius: '6px',
            fontWeight: '600'
          }}>
            Current
          </span>
        )}
      </div>

      {entry.description && (
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
          {entry.description}
        </p>
      )}

      {entry.skills && entry.skills.length > 0 && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {entry.skills.slice(0, 8).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  padding: '2px 6px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '11px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                {skill}
              </span>
            ))}
            {entry.skills.length > 8 && (
              <span style={{
                fontSize: '11px',
                color: '#6b7280',
                padding: '2px 6px'
              }}>
                +{entry.skills.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 