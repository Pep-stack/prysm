'use client';

import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Section Component ---
export default function SortableCardSection({ id, children, onRemove, onClick, sectionData }) {
  // console.log('SortableCardSection rendered. id:', id, 'onRemove exists:', !!onRemove, 'onClick exists:', !!onClick); // Removed log
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    border: isDragging ? '1px dashed gray' : '1px solid #eee',
    padding: '10px',
    paddingLeft: '30px', // Make space for drag handle
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const dragHandleStyle = {
    position: 'absolute',
    left: '5px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'grab',
    padding: '5px',
    color: '#888',
    touchAction: 'none', // Important for dnd-kit listeners
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    lineHeight: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 1,
    display: isDragging ? 'none' : 'block',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={() => {
         if (onClick) onClick(sectionData);
      }}
    >
      <span 
        style={dragHandleStyle} 
        {...listeners} 
        {...attributes}
        aria-label="Drag to reorder section"
      >
        ⠿ {/* Grip icon */} 
      </span>
      
      {children}
      
      <button 
        style={removeButtonStyle} 
        onClick={(e) => {
          e.stopPropagation(); // Prevent onClick of the main div
          // console.log('Remove button clicked for id:', id); // Removed log
          if (onRemove) onRemove(id); 
        }}
        aria-label={`Remove ${id} section`}
      >
        X
      </button>
    </div>
  );
}
// --- End Sortable Section Component --- 