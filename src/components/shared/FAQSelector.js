'use client';

import React, { useState } from 'react';
import { LuCircleHelp, LuPlus, LuTrash2, LuPencil, LuChevronDown, LuChevronRight } from 'react-icons/lu';

export default function FAQSelector({ value = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [newEntry, setNewEntry] = useState({
    question: '',
    answer: '',
    category: '',
    featured: false
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      question: '',
      answer: '',
      category: '',
      featured: false
    });
  };

  const handleSaveNew = () => {
    if (newEntry.question && newEntry.answer) {
      const updatedFAQs = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedFAQs);
      setEditingIndex(null);
      setNewEntry({
        question: '',
        answer: '',
        category: '',
        featured: false
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...value[index] });
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedFAQs = [...value];
    updatedFAQs[index] = updatedEntry;
    onChange(updatedFAQs);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedFAQs = value.filter((_, i) => i !== index);
    onChange(updatedFAQs);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewEntry({
      question: '',
      answer: '',
      category: '',
      featured: false
    });
  };

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getCategories = () => {
    const categories = [...new Set(value.map(item => item.category).filter(Boolean))];
    return categories;
  };

  const groupedFAQs = () => {
    const categories = getCategories();
    if (categories.length === 0) {
      return { 'General': value };
    }

    const grouped = {};
    categories.forEach(category => {
      grouped[category] = value.filter(item => item.category === category);
    });
    
    // Add uncategorized items
    const uncategorized = value.filter(item => !item.category);
    if (uncategorized.length > 0) {
      grouped['General'] = uncategorized;
    }

    return grouped;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <LuPlus size={16} />
          Add FAQ
        </button>
      </div>

      {value.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500">
          <LuCircleHelp size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No FAQs yet. Add your first frequently asked question to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(groupedFAQs()).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {getCategories().length > 0 && (
              <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                {category}
              </h4>
            )}
            <div className="space-y-2">
              {items.map((item, index) => {
                const globalIndex = value.findIndex(faq => faq.id === item.id);
                const isExpanded = expandedItems.has(globalIndex);
                
                return (
                  <div key={item.id || index} className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleExpanded(globalIndex)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900">{item.question}</h5>
                        {item.featured && (
                          <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <LuChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <LuChevronRight size={16} className="text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-3">
                        <p className="text-sm text-gray-600 mb-3">{item.answer}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(globalIndex)}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                                                       <LuPencil size={14} />
                           Edit
                          </button>
                          <button
                            onClick={() => handleDelete(globalIndex)}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700"
                          >
                            <LuTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingIndex === 'new' ? 'Add New FAQ' : 'Edit FAQ'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  value={newEntry.question}
                  onChange={(e) => setNewEntry({ ...newEntry, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="What is your question?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer *
                </label>
                <textarea
                  value={newEntry.answer}
                  onChange={(e) => setNewEntry({ ...newEntry, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Provide a clear and helpful answer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="General, Pricing, Services, etc."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newEntry.featured}
                  onChange={(e) => setNewEntry({ ...newEntry, featured: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Mark as featured
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingIndex === 'new') {
                    handleSaveNew();
                  } else {
                    handleSaveEdit(editingIndex, newEntry);
                  }
                }}
                disabled={!newEntry.question || !newEntry.answer}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 