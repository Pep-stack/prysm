'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableCardOption({ option }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: option.id,
    data: { // Pass option data for drop handling
      type: 'card-option',
      option: option,
    }
  });

  const style = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px 15px',
    marginBottom: '10px',
    backgroundColor: 'white',
    cursor: 'grab', 
    textAlign: 'center',
    fontWeight: 'bold',
    transform: CSS.Translate.toString(transform),
    opacity: transform ? 0.8 : 1, // Make it slightly transparent when dragging
    touchAction: 'none', // Recommended for preventing scrolling issues on touch devices
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {option.name}
    </div>
  );
}; 