'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { EditableSectionItem } from './EditableSectionItem';
import { LuChevronDown } from 'react-icons/lu';

export default function SocialBarDropzone({ sections = [], onRemoveSection, onEditSection }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setNodeRef, isOver } = useDroppable({
    id: 'social-bar-dropzone',
    data: { type: 'social-bar' }
  });

  return (
    <div className="mb-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Social Media Bar
          {sections.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {sections.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={isExpanded ? 'Collapse social media bar' : 'Expand social media bar'}
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          <LuChevronDown 
            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
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
      )}
    </div>
  );
} 