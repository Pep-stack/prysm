'use client';

import React, { useState } from 'react';
import { LuCircleHelp, LuPlus, LuTrash2, LuX } from 'react-icons/lu';

export default function FAQSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  console.log('🔍 FAQ-SELECTOR: Received props:', {
    value,
    valueType: typeof value,
    isArray: Array.isArray(value),
    valueLength: Array.isArray(value) ? value.length : 'not array',
    valueKeys: Array.isArray(value) && value.length > 0 ? Object.keys(value[0]) : 'no items'
  });
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    question: '',
    answer: ''
  });

  const handleAddNew = () => {
    if (value.length >= 5) {
      alert('Maximum 5 FAQ items allowed');
      return;
    }
    setEditingIndex('new');
    setNewEntry({
      question: '',
      answer: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.question.trim() && newEntry.answer.trim()) {
      const newFAQ = {
        id: Date.now(),
        question: newEntry.question.trim(),
        answer: newEntry.answer.trim()
      };
      const updatedFAQs = [...value, newFAQ];
      // Ensure we're passing a clean array without circular references
      const cleanFAQs = updatedFAQs.map(item => ({
        id: item.id,
        question: item.question,
        answer: item.answer
      }));
      console.log('🔍 FAQ-SELECTOR: handleSaveNew calling onChange with:', cleanFAQs);
      console.log('🔍 FAQ-SELECTOR: handleSaveNew - onChange function:', typeof onChange);
      
      // Extra safety check - test if the data can be serialized
      try {
        JSON.stringify(cleanFAQs);
        console.log('✅ FAQ-SELECTOR: Data can be serialized successfully');
      } catch (error) {
        console.error('❌ FAQ-SELECTOR: Data cannot be serialized:', error);
        // Try to create an even cleaner version
        const ultraCleanFAQs = cleanFAQs.map(item => ({
          id: item.id,
          question: String(item.question || ''),
          answer: String(item.answer || '')
        }));
        console.log('🔧 FAQ-SELECTOR: Using ultra clean version:', ultraCleanFAQs);
        onChange(ultraCleanFAQs);
        return;
      }
      
      onChange(cleanFAQs);
      setEditingIndex(null);
      setNewEntry({
        question: '',
        answer: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ 
      question: value[index].question || '',
      answer: value[index].answer || ''
    });
  };

  const handleSaveEdit = (index) => {
    if (newEntry.question.trim() && newEntry.answer.trim()) {
      const updatedFAQs = [...value];
      updatedFAQs[index] = {
        id: value[index].id || Date.now(),
        question: newEntry.question.trim(),
        answer: newEntry.answer.trim()
      };
      // Ensure we're passing a clean array without circular references
      const cleanFAQs = updatedFAQs.map(item => ({
        id: item.id,
        question: item.question,
        answer: item.answer
      }));
      
      // Extra safety check - test if the data can be serialized
      try {
        JSON.stringify(cleanFAQs);
        console.log('✅ FAQ-SELECTOR: handleSaveEdit - Data can be serialized successfully');
      } catch (error) {
        console.error('❌ FAQ-SELECTOR: handleSaveEdit - Data cannot be serialized:', error);
        // Try to create an even cleaner version
        const ultraCleanFAQs = cleanFAQs.map(item => ({
          id: item.id,
          question: String(item.question || ''),
          answer: String(item.answer || '')
        }));
        console.log('🔧 FAQ-SELECTOR: handleSaveEdit - Using ultra clean version:', ultraCleanFAQs);
        onChange(ultraCleanFAQs);
        setEditingIndex(null);
        setNewEntry({
          question: '',
          answer: ''
        });
        return;
      }
      
      onChange(cleanFAQs);
      setEditingIndex(null);
      setNewEntry({
        question: '',
        answer: ''
      });
    }
  };

  const handleDelete = (index) => {
    const updatedFAQs = value.filter((_, i) => i !== index);
    // Ensure we're passing a clean array without circular references
    const cleanFAQs = updatedFAQs.map(item => ({
      id: item.id,
      question: item.question,
      answer: item.answer
    }));
    
    // Extra safety check - test if the data can be serialized
    try {
      JSON.stringify(cleanFAQs);
      console.log('✅ FAQ-SELECTOR: handleDelete - Data can be serialized successfully');
    } catch (error) {
      console.error('❌ FAQ-SELECTOR: handleDelete - Data cannot be serialized:', error);
      // Try to create an even cleaner version
      const ultraCleanFAQs = cleanFAQs.map(item => ({
        id: item.id,
        question: String(item.question || ''),
        answer: String(item.answer || '')
      }));
      console.log('🔧 FAQ-SELECTOR: handleDelete - Using ultra clean version:', ultraCleanFAQs);
      onChange(ultraCleanFAQs);
      return;
    }
    
    onChange(cleanFAQs);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      question: '',
      answer: ''
    });
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
      handleSaveEdit(editingIndex);
    } else {
      // Just close editing mode
      setEditingIndex(null);
    }
    
    // Save to database via modal
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
      {/* FAQ Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#8b5cf6'
          }}>
            <LuCircleHelp className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">FAQ</h3>
            <p className="text-gray-400 text-sm">Frequently asked questions (max 5)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing FAQ Items */}
        {value.map((item, index) => (
          <FAQEntry
            key={item.id || index}
            item={item}
            index={index}
            isEditing={editingIndex === index}
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            onEdit={() => handleEdit(index)}
            onSave={() => handleSaveEdit(index)}
            onDelete={() => handleDelete(index)}
            onCancel={() => {
              setEditingIndex(null);
              setNewEntry({ question: '', answer: '' });
            }}
          />
        ))}

        {/* Add New Entry */}
        {editingIndex === 'new' ? (
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Question *
                </label>
                <input
                  type="text"
                  value={newEntry.question}
                  onChange={(e) => setNewEntry({ ...newEntry, question: e.target.value })}
                  placeholder="What is your question?"
                  maxLength={100}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-gray-400 text-xs mt-1">
                  {newEntry.question.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Answer *
                </label>
                <textarea
                  value={newEntry.answer}
                  onChange={(e) => setNewEntry({ ...newEntry, answer: e.target.value })}
                  placeholder="Provide a clear and helpful answer"
                  maxLength={300}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                />
                <p className="text-gray-400 text-xs mt-1">
                  {newEntry.answer.length}/300 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setNewEntry({ question: '', answer: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  disabled={!newEntry.question.trim() || !newEntry.answer.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        ) : value.length < 5 ? (
          <button
            onClick={handleAddNew}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            + Add FAQ
          </button>
        ) : null}

        {/* Empty State */}
        {value.length === 0 && editingIndex !== 'new' && (
          <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCircleHelp size={24} className="text-purple-300" />
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">No FAQs yet</h4>
            <p className="text-gray-400 text-sm mb-4">Add frequently asked questions to help visitors</p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Add First FAQ
            </button>
          </div>
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
              backgroundColor: '#8b5cf6',
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

// FAQEntry component for display and inline editing
function FAQEntry({ item, index, isEditing, newEntry, setNewEntry, onEdit, onSave, onDelete, onCancel }) {
  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Question *
            </label>
            <input
              type="text"
              value={newEntry.question}
              onChange={(e) => setNewEntry({ ...newEntry, question: e.target.value })}
              placeholder="What is your question?"
              maxLength={100}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-gray-400 text-xs mt-1">
              {newEntry.question.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Answer *
            </label>
            <textarea
              value={newEntry.answer}
              onChange={(e) => setNewEntry({ ...newEntry, answer: e.target.value })}
              placeholder="Provide a clear and helpful answer"
              maxLength={300}
              rows={4}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
            />
            <p className="text-gray-400 text-xs mt-1">
              {newEntry.answer.length}/300 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!newEntry.question.trim() || !newEntry.answer.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg mb-2">
            {item.question}
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {item.answer}
          </p>
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