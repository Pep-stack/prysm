'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { EditableSectionItem } from './EditableSectionItem';

export default function SocialBarDropzone({ sections = [], onRemoveSection, onEditSection }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'social-bar-dropzone',
    data: { type: 'social-bar' }
  });

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Social Media Bar</h3>
      <div
        ref={setNodeRef}
        className={`w-full min-h-[60px] flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200
          ${isOver 
            ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200' 
            : 'border-dashed border-gray-300 bg-gray-50'
          }
          ${sections.length > 0 ? 'bg-white border-solid border-gray-200' : ''}
        `}
      >
        {sections.length === 0 ? (
          <div className="w-full text-center">
            <p className="text-gray-400 text-sm">Drag social media sections here</p>
            <p className="text-gray-300 text-xs mt-1">This will appear as a horizontal bar under the profile info</p>
          </div>
        ) : (
          <SortableContext items={sections.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-2 w-full">
              {sections.map((section) => (
                <div key={section.id} className="flex-shrink-0 max-w-[200px]">
                  <EditableSectionItem
                    id={section.id}
                    section={section}
                    onRemove={onRemoveSection}
                    onEdit={onEditSection}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
} 