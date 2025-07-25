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

export default function SkillsSelector({ value = [], onChange }) {
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
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '14px' }}>
        Skills & Technologies:
      </label>

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
          + Add Skill
        </button>
      )}
    </div>
  );
}

function SkillEntry({ entry, index, isEditing, isNew, onEdit, onSave, onDelete, onCancel, onChange }) {
  const [localEntry, setLocalEntry] = useState(entry);

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
              Skill Name *
            </label>
            <input
              type="text"
              value={localEntry.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., React, Python, AWS"
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
              Category *
            </label>
            <select
              value={localEntry.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Category</option>
              {Object.keys(SKILL_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Proficiency Level
            </label>
            <select
              value={localEntry.proficiency}
              onChange={(e) => handleInputChange('proficiency', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={localEntry.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              placeholder="e.g., 3"
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
            Description (Optional)
          </label>
          <textarea
            value={localEntry.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your experience with this skill..."
            rows="3"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Save
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
            {entry.category}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              padding: '2px 8px',
              backgroundColor: getProficiencyColor(entry.proficiency),
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {getProficiencyLabel(entry.proficiency)}
            </span>
            {entry.yearsOfExperience && (
              <span style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {entry.yearsOfExperience} year{entry.yearsOfExperience !== '1' ? 's' : ''}
              </span>
            )}
          </div>
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

      {entry.description && (
        <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
          {entry.description}
        </p>
      )}
    </div>
  );
} 