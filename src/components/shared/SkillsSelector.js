'use client';

import React, { useState } from 'react';

// Predefined skill categories and skills
const SKILL_CATEGORIES = {
  'Programming Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB'
  ],
  'Frontend Development': [
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design'
  ],
  'Backend Development': [
    'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'FastAPI', 'GraphQL', 'REST APIs'
  ],
  'Databases': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase', 'Supabase', 'DynamoDB', 'Cassandra'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Ansible', 'Vagrant'
  ],
  'Mobile Development': [
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Native Android', 'Native iOS', 'Cordova', 'PhoneGap'
  ],
  'Data Science & AI': [
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'OpenCV', 'NLTK', 'SpaCy'
  ],
  'Design & Creative': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'Blender', 'Cinema 4D'
  ],
  'Project Management': [
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Asana', 'Monday.com', 'Notion', 'Confluence', 'Slack', 'Microsoft Teams'
  ],
  'Other Technologies': [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Postman', 'Insomnia', 'Webpack', 'Vite', 'npm', 'yarn'
  ]
};

export default function SkillsSelector({ value = [], onChange, onSave: modalOnSave, onCancel: modalOnCancel }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    category: '',
    proficiency: 'intermediate', // beginner, intermediate, advanced, expert
    yearsOfExperience: '',
    description: ''
  });

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewEntry({
      name: '',
      category: '',
      proficiency: 'intermediate',
      yearsOfExperience: '',
      description: ''
    });
  };

  const handleSaveNew = () => {
    if (newEntry.name && newEntry.category) {
      const updatedSkills = [...value, { ...newEntry, id: Date.now() }];
      onChange(updatedSkills);
      setEditingIndex(null);
      setNewEntry({
        name: '',
        category: '',
        proficiency: 'intermediate',
        yearsOfExperience: '',
        description: ''
      });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedEntry) => {
    const updatedSkills = [...value];
    updatedSkills[index] = updatedEntry;
    onChange(updatedSkills);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedSkills = value.filter((_, i) => i !== index);
    onChange(updatedSkills);
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
      {/* Skills Header */}
      <div className="flex items-center justify-between p-6 pb-4" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ 
            backgroundColor: '#8b5cf6'
          }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Skills & Technologies</h3>
            <p className="text-gray-400 text-sm">Showcase your technical expertise</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Existing Skills Entries */}
        {value.map((entry, index) => (
          <SkillEntry
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
          <SkillEntry
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
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors font-medium"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            + Add Skill
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

function SkillEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  // Initialize with default structure to prevent undefined errors
  const defaultEntry = {
    name: '',
    category: '',
    proficiency: 'intermediate',
    yearsOfExperience: '',
    description: '',
    ...entry // Override with actual entry data
  };
  
  const [localEntry, setLocalEntry] = useState(defaultEntry);

  // Sync localEntry with entry prop
  React.useEffect(() => {
    const safeEntry = {
      name: '',
      category: '',
      proficiency: 'intermediate',
      yearsOfExperience: '',
      description: '',
      ...entry // Override with actual entry data
    };
    setLocalEntry(safeEntry);
  }, [entry]);

  const handleInputChange = (field, value) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (localEntry.name && localEntry.category) {
      onSave(localEntry);
    }
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      beginner: '#10b981',
      intermediate: '#f59e0b',
      advanced: '#3b82f6',
      expert: '#8b5cf6'
    };
    return colors[proficiency] || '#6b7280';
  };

  const getProficiencyLabel = (proficiency) => {
    const labels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    };
    return labels[proficiency] || 'Intermediate';
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        {/* Skill Name and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Skill Name *
            </label>
            <input
              type="text"
              value={localEntry.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., React, Python, Adobe Photoshop"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Category *
            </label>
            <select
              value={localEntry.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {Object.keys(SKILL_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Proficiency and Years of Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Proficiency Level
            </label>
            <select
              value={localEntry.proficiency || 'intermediate'}
              onChange={(e) => handleInputChange('proficiency', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Years of Experience
            </label>
            <input
              type="text"
              value={localEntry.yearsOfExperience || ''}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              placeholder="e.g., 2-3 years, 5+ years"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2 text-sm">
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your experience with this skill, projects you've used it on, or specific expertise..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical min-h-20"
          />
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="p-4 mb-3 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-white font-semibold text-lg">
              {entry.name || 'Untitled Skill'}
            </h4>
            <span 
              className="px-2 py-1 text-xs font-medium rounded"
              style={{
                backgroundColor: getProficiencyColor(entry.proficiency) + '30',
                color: getProficiencyColor(entry.proficiency)
              }}
            >
              {getProficiencyLabel(entry.proficiency)}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded">
              {entry.category || 'Uncategorized'}
            </span>
            {entry.yearsOfExperience && (
              <span className="text-gray-400 text-sm">
                {entry.yearsOfExperience} experience
              </span>
            )}
          </div>

          {entry.description && (
            <p className="text-gray-400 text-sm leading-relaxed">
              {entry.description}
            </p>
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