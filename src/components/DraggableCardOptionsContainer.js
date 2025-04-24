'use client';

import React from 'react';
import DraggableCardOption from './DraggableCardOption'; // Import the component we just created

export default function DraggableCardOptionsContainer() {
  // List of available card sections/options (could be fetched or defined elsewhere)
  const cardOptions = [
    { id: 'bio', name: 'Bio Section', inputType: 'textarea' },
    { id: 'skills', name: 'Skills Section', inputType: 'text', placeholder: 'Comma-separated, e.g., React, Node.js' },
    { id: 'contact', name: 'Contact Info', inputType: 'none' }, 
    { id: 'location', name: 'Location', inputType: 'text' },
    { id: 'website', name: 'Website Link', inputType: 'url' },
  ];

  return (
    <div>
      <p style={{ marginBottom: '15px', color: '#555' }}>Available Sections:</p>
      <div>
        {cardOptions
          .filter(option => option.inputType !== 'none') // Filter out non-editable/non-draggable options
          .map((option) => (
            <DraggableCardOption key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
}; 