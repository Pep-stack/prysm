'use client';

import React from 'react';
import { SECTION_OPTIONS } from '../../lib/sectionOptions'; // Importeer de opties
import { getIconForSection } from '../../lib/sectionIcons'; // Importeer de icon helper

// Basis Modal structuur (je kunt een bestaande modal library of component gebruiken)
export default function AddSectionModal({ isOpen, onClose, onSelectSection, existingSectionIds = [] }) {
  // Render null als de modal niet open is
  if (!isOpen) return null;

  const availableOptions = SECTION_OPTIONS.filter(option => !existingSectionIds.includes(option.id));
  // OF filter op type als ID's niet uniek zijn per type maar gegenereerd
  // const existingSectionTypes = existingSections.map(s => s.type);
  // const availableOptions = SECTION_OPTIONS.filter(option => !existingSectionTypes.includes(option.type));

  // De JSX voor de modal zelf - render direct
  return (
    // Outer Wrapper: Fixed position, hoge z-index, covers screen (GEEN flex centering meer hier)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] p-4"> {/* Verwijder flex, justify-center, items-center */}

        {/* Klik buiten de modal om te sluiten (overlay) */}
        <div className="fixed inset-0 z-[101]" onClick={onClose}></div>

        {/* Modal Content Box - Gebruik absolute positionering + transform/translate voor centreren */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[102] bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">

          {/* Modal Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Add New Section</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="flex-1 p-4 overflow-y-auto">
            {availableOptions.length === 0 ? (
               <p className='text-gray-600 text-center'>All available sections have been added.</p>
            ) : (
              <ul className="space-y-2">
                {availableOptions.map((option) => {
                  const Icon = getIconForSection(option.type);
                  return (
                    <li key={option.id}>
                      <button
                        onClick={() => onSelectSection(option.type)}
                        className="w-full flex items-center p-3 text-left rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="mr-3 text-gray-600">
                           {Icon && <Icon size={20} />}
                        </span>
                        <span className="text-sm font-medium text-black">{option.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 text-right">
             <button
               onClick={onClose}
               className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm"
             >
                Cancel
             </button>
          </div>
        </div>
    </div>
  );
} 