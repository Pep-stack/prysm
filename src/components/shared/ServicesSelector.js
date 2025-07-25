'use client';

import React, { useState } from 'react';
import { LuPlus, LuPencil, LuTrash2, LuSave, LuX, LuWrench, LuDollarSign, LuClock, LuStar } from 'react-icons/lu';

// Predefined service categories
const SERVICE_CATEGORIES = {
  'Web Development': [
    'Frontend Development', 'Backend Development', 'Full-Stack Development', 'E-commerce Development', 'CMS Development', 'API Development'
  ],
  'Mobile Development': [
    'iOS Development', 'Android Development', 'Cross-platform Development', 'React Native Development', 'Flutter Development'
  ],
  'Design & Creative': [
    'UI/UX Design', 'Graphic Design', 'Logo Design', 'Brand Identity', 'Web Design', 'Print Design', 'Illustration'
  ],
  'Digital Marketing': [
    'SEO Optimization', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC Advertising', 'Analytics & Reporting'
  ],
  'Business Services': [
    'Consulting', 'Project Management', 'Business Strategy', 'Process Optimization', 'Training & Workshops'
  ],
  'Technical Services': [
    'DevOps & Cloud', 'Database Design', 'System Architecture', 'Security Audits', 'Performance Optimization', 'Technical Support'
  ],
  'Content Creation': [
    'Content Writing', 'Copywriting', 'Video Production', 'Photography', 'Podcast Production', 'Social Media Content'
  ],
  'Other Services': [
    'Custom Development', 'Integration Services', 'Maintenance & Support', 'Custom Solutions'
  ]
};

export default function ServicesSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    duration: '',
    features: [],
    expertise: 'intermediate', // beginner, intermediate, advanced, expert
    isPopular: false
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      title: '',
      category: '',
      subcategory: '',
      description: '',
      price: '',
      duration: '',
      features: [],
      expertise: 'intermediate',
      isPopular: false
    });
  };

  const handleSaveNew = () => {
    if (newEntry.title && newEntry.category) {
      const updatedServices = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedServices);
      setEditingIndex(null);
      setNewEntry({
        title: '',
        category: '',
        subcategory: '',
        description: '',
        price: '',
        duration: '',
        features: [],
        expertise: 'intermediate',
        isPopular: false
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedServices = [...value];
    updatedServices[index] = updatedEntry;
    onChange(updatedServices);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedServices = value.filter((_, i) => i !== index);
    onChange(updatedServices);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Services Offered:
      </label>

      {/* Add New Service Button */}
      <button
        onClick={handleAddNew}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          color: '#64748b',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: '100%',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f1f5f9';
          e.target.style.borderColor = '#94a3b8';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f8fafc';
          e.target.style.borderColor = '#cbd5e1';
        }}
      >
        <LuPlus size={16} />
        Add New Service
      </button>

      {/* Existing Services */}
      {value.map((service, index) => (
        <ServiceEntry
          key={service.id || index}
          entry={service}
          index={index}
          isEditing={editingIndex === index}
          isNew={false}
          onEdit={() => handleEdit(index)}
          onSave={(updatedEntry) => handleSaveEdit(index, updatedEntry)}
          onDelete={() => handleDelete(index)}
          onCancel={handleCancel}
          onChange={(updatedEntry) => {
            const updatedServices = [...value];
            updatedServices[index] = updatedEntry;
            onChange(updatedServices);
          }}
        />
      ))}

      {/* New Service Entry */}
      {editingIndex === 'new' && (
        <ServiceEntry
          entry={newEntry}
          index="new"
          isEditing={true}
          isNew={true}
          onEdit={() => {}}
          onSave={handleSaveNew}
          onDelete={handleCancel}
          onCancel={handleCancel}
          onChange={setNewEntry}
        />
      )}
    </div>
  );
}

function ServiceEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ ...entry, [field]: value });
  };

  const handleSave = () => {
    if (entry.title && entry.category) {
      onSave(entry);
    }
  };

  const getExpertiseColor = (expertise) => {
    const colors = {
      beginner: '#059669',
      intermediate: '#0284c7',
      advanced: '#7c3aed',
      expert: '#dc2626'
    };
    return colors[expertise] || colors.intermediate;
  };

  const getExpertiseLabel = (expertise) => {
    const labels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    };
    return labels[expertise] || 'Intermediate';
  };

  const addFeature = () => {
    const newFeature = prompt('Enter a feature or benefit of this service:');
    if (newFeature && newFeature.trim()) {
      handleInputChange('features', [...entry.features, newFeature.trim()]);
    }
  };

  const removeFeature = (featureIndex) => {
    const updatedFeatures = entry.features.filter((_, index) => index !== featureIndex);
    handleInputChange('features', updatedFeatures);
  };

  if (isEditing) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            {isNew ? 'Add New Service' : 'Edit Service'}
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LuSave size={14} />
              Save
            </button>
            <button
              onClick={onCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LuX size={14} />
              Cancel
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Service Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Service Title *
            </label>
            <input
              type="text"
              value={entry.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Custom Web Development"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Category *
            </label>
            <select
              value={entry.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select Category</option>
              {Object.keys(SERVICE_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategory */}
        {entry.category && SERVICE_CATEGORIES[entry.category] && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Subcategory
            </label>
            <select
              value={entry.subcategory || ''}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select Subcategory</option>
              {SERVICE_CATEGORIES[entry.category].map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
            Description
          </label>
          <textarea
            value={entry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your service, what clients can expect, and the value you provide..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Price */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Price Range
            </label>
            <input
              type="text"
              value={entry.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="e.g., $500-2000"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Duration
            </label>
            <input
              type="text"
              value={entry.duration || ''}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 2-4 weeks"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Expertise Level */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Expertise Level
            </label>
            <select
              value={entry.expertise || 'intermediate'}
              onChange={(e) => handleInputChange('expertise', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Popular Service Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={entry.isPopular || false}
              onChange={(e) => handleInputChange('isPopular', e.target.checked)}
              style={{ margin: 0 }}
            />
            Mark as Popular Service
          </label>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Features & Benefits
            </label>
            <button
              onClick={addFeature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LuPlus size={12} />
              Add Feature
            </button>
          </div>
          
          {entry.features && entry.features.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {entry.features.map((feature, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}>
                  <span style={{ flex: 1, fontSize: '13px', color: '#374151' }}>{feature}</span>
                  <button
                    onClick={() => removeFeature(idx)}
                    style={{
                      padding: '4px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#dc2626'
                    }}
                  >
                    <LuX size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '13px'
            }}>
              No features added yet. Click "Add Feature" to get started.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              {entry.title || 'Untitled Service'}
            </h4>
            {entry.isPopular && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                fontSize: '10px',
                fontWeight: '600',
                borderRadius: '12px',
                border: '1px solid #fbbf24'
              }}>
                <LuStar size={10} />
                POPULAR
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              padding: '4px 8px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontSize: '11px',
              fontWeight: '500',
              borderRadius: '6px'
            }}>
              {entry.category || 'Uncategorized'}
            </span>
            {entry.subcategory && (
              <span style={{
                padding: '4px 8px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                fontSize: '11px',
                fontWeight: '500',
                borderRadius: '6px'
              }}>
                {entry.subcategory}
              </span>
            )}
            <span style={{
              padding: '4px 8px',
              backgroundColor: getExpertiseColor(entry.expertise) + '20',
              color: getExpertiseColor(entry.expertise),
              fontSize: '11px',
              fontWeight: '500',
              borderRadius: '6px'
            }}>
              {getExpertiseLabel(entry.expertise)}
            </span>
          </div>

          {entry.description && (
            <p style={{
              margin: '8px 0 0 0',
              fontSize: '13px',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              {entry.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            {entry.price && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                <LuDollarSign size={12} />
                {entry.price}
              </div>
            )}
            {entry.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                <LuClock size={12} />
                {entry.duration}
              </div>
            )}
          </div>

          {entry.features && entry.features.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {entry.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} style={{
                    padding: '3px 8px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '11px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {feature}
                  </span>
                ))}
                {entry.features.length > 3 && (
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    padding: '3px 8px'
                  }}>
                    +{entry.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={onEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LuPencil size={12} />
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#dc2626',
              transition: 'all 0.2s ease'
            }}
          >
            <LuTrash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 