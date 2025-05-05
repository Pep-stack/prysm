'use client';

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditableSectionItem } from './EditableSectionItem';

export default function EditableSectionList({ items = [], onRemoveSection, onEditSection }) {

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Your card is empty.</p>
        <p className="text-sm text-gray-400 mt-2">Add sections to build your profile.</p>
        {/* Voeg hier later een "Add Section" knop toe */}
      </div>
    );
  }

  return (
    <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-3"> {/* Use space-y for consistent spacing */}
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
  );
} 