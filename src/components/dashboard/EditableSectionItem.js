'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LuGripVertical, LuTrash2, LuPencil } from 'react-icons/lu'; // Lucide icons
import { SECTION_OPTIONS } from '../../lib/sectionOptions';

export function EditableSectionItem({ id, section, onRemove, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto', // Ensure dragged item is on top
  };

  // Zoek het juiste icoon op basis van section.type
  const option = SECTION_OPTIONS.find(opt => opt.type === section.type);
  const Icon = option?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 flex items-center gap-3 touch-none" // touch-none is belangrijk voor dnd-kit
    >
      {/* Drag Handle */}
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
        <LuGripVertical size={20} />
      </button>

      {/* Icon */}
      <div className="text-gray-600">
        {Icon && <Icon size={20} />}
      </div>

      {/* Content & Edit Trigger */}
      <div className="flex-1 min-w-0">
        <button onClick={() => onEdit(section)} className="text-left w-full hover:text-[#00C896]">
          <p className="text-sm font-medium text-black truncate">{section.title || section.type}</p>
          {/* Toon eventueel subtitel of content preview */}
          {section.value && typeof section.value === 'string' && (
            <p className="text-xs text-gray-500 truncate">{section.value}</p>
          )}
        </button>
      </div>

      {/* Actions (Edit/Remove) */}
      <div className="flex items-center gap-2">
         <button onClick={() => onEdit(section)} className="text-gray-400 hover:text-[#00C896] p-1" aria-label="Edit section">
             <LuPencil size={16} />
         </button>
         <button onClick={() => onRemove(section.id)} className="text-gray-400 hover:text-red-500 p-1" aria-label="Remove section">
           <LuTrash2 size={16} />
         </button>
      </div>
    </div>
  );
} 