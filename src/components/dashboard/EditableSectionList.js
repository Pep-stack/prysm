'use client';

import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditableSectionItem } from './EditableSectionItem';
import { LuChevronDown } from 'react-icons/lu';

export default function EditableSectionList({ items = [], onRemoveSection, onEditSection }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const emptyState = (
    <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
      <p className="text-gray-500">Your card is empty.</p>
      <p className="text-sm text-gray-400 mt-2">Add sections to build your profile.</p>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Container with header and collapsible content */}
      <div className="w-full rounded-lg border border-gray-200 bg-white">
        {/* Header with toggle - always visible */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-sm font-medium text-gray-700">
            Card Sections
            {items.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={isExpanded ? 'Collapse card sections' : 'Expand card sections'}
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <LuChevronDown 
              className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>

        {/* Collapsible content */}
        {isExpanded && (
          <div className="px-4 pb-4">
            {!items || items.length === 0 ? (
              emptyState
            ) : (
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {items.map((section) => (
                    <EditableSectionItem
                      key={section.id}
                      id={section.id}
                      section={section}
                      onRemove={onRemoveSection}
                      onEdit={onEditSection}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 