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

export default function ServicesSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
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
    // If we have a modal cancel function, call it
    if (modalOnCancel) {
      modalOnCancel();
    }
  };

  const handleSave = () => {
    // If we're editing something, save it first
    if (editingIndex === 'new') {
      handleSaveNew();
    } else if (editingIndex !== null) {
      // For existing entries, just close editing mode
      setEditingIndex(null);
    }
    
    // Now save to database via modal
    if (modalOnSave) {
      modalOnSave();
    }
  };

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #333',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Services Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#059669'
          }}>
            <LuWrench className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Services Offered</h3>
            <p className="text-gray-400 text-sm">Manage your professional services</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
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
        {editingIndex === 'new' ? (
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
        ) : (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            + Add Service
          </button>
        )}

        {/* Save/Cancel Buttons - Always visible at bottom */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: '#059669',
              color: 'white'
            }}
          >
            Save
          </button>
        </div>
      </div>
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
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Title and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Service Title *
            </label>
            <input
              type="text"
              value={entry.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Custom Web Development"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Category *
            </label>
            <select
              value={entry.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {Object.keys(SERVICE_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategory and Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Subcategory
            </label>
            <select
              value={entry.subcategory || ''}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              disabled={!entry.category}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select Subcategory</option>
              {entry.category && SERVICE_CATEGORIES[entry.category]?.map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Expertise Level
            </label>
            <select
              value={entry.expertise || 'intermediate'}
              onChange={(e) => handleInputChange('expertise', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Description
          </label>
          <textarea
            value={entry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your service, what's included, and the value you provide..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical min-h-20"
          />
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Price
            </label>
            <input
              type="text"
              value={entry.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="e.g., $1,500, €50/hour, Contact for quote"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Duration/Timeline
            </label>
            <input
              type="text"
              value={entry.duration || ''}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 2-4 weeks, 1 month, Ongoing"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <label className="block text-white font-medium mb-2 text-sm">
            Features & Benefits
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Add Feature
            </button>
          </div>
          {entry.features && entry.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full flex items-center gap-2"
                >
                  {feature}
                  <button
                    onClick={() => removeFeature(idx)}
                    className="text-gray-400 hover:text-white"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Popular Service Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={entry.isPopular || false}
              onChange={(e) => handleInputChange('isPopular', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-900 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-white font-medium text-sm">Mark as Popular Service</span>
          </label>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-white font-semibold text-lg">
              {entry.title || 'Untitled Service'}
            </h4>
            {entry.isPopular && (
              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-900 text-yellow-300 text-xs font-semibold rounded-full">
                <LuStar size={10} />
                POPULAR
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs font-medium rounded">
              {entry.category || 'Uncategorized'}
            </span>
            {entry.subcategory && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                {entry.subcategory}
              </span>
            )}
            <span 
              className="px-2 py-1 text-xs font-medium rounded"
              style={{
                backgroundColor: getExpertiseColor(entry.expertise) + '30',
                color: getExpertiseColor(entry.expertise)
              }}
            >
              {getExpertiseLabel(entry.expertise)}
            </span>
          </div>

          {entry.description && (
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              {entry.description}
            </p>
          )}

          <div className="flex items-center gap-4 mb-3">
            {entry.price && (
              <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                <LuDollarSign size={12} />
                {entry.price}
              </div>
            )}
            {entry.duration && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <LuClock size={12} />
                {entry.duration}
              </div>
            )}
          </div>

          {entry.features && entry.features.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {entry.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {feature}
                  </span>
                ))}
                {entry.features.length > 3 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{entry.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-900 text-red-300 text-xs rounded hover:bg-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 