'use client';

import React, { useState } from 'react';
// Importeer de NIEUWE grouping functie
import { getGroupedSectionOptions } from '../../lib/sectionOptions'; // Verwijder import SECTION_OPTIONS als niet direct nodig
// VERWIJDER import { getIconForSection } from '../../lib/sectionIcons';
import { LuChevronDown } from "react-icons/lu"; // Icoon voor dropdown pijl

// ForwardRef is nodig om de ref van buitenaf te kunnen koppelen voor click-outside detectie
const AddSectionPopover = React.forwardRef(({ isOpen, onSelectSection, existingSectionTypes = [] }, ref) => {
  // State om bij te houden welke categorieën open zijn. Start gesloten.
  const [openCategories, setOpenCategories] = useState({});

  if (!isOpen) return null;

  // Gebruik de grouping functie met de bestaande types
  const groupedAvailableOptions = getGroupedSectionOptions(existingSectionTypes);
  const categories = Object.keys(groupedAvailableOptions);

  // Functie om een categorie te openen/sluiten
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev, // Behoud de staat van andere categorieën
      [category]: !prev[category] // Toggle de staat van de geklikte categorie
    }));
  };

  return (
    // Positionering aangepast: left-0 right-0 om breedte te forceren
    // Verwijder max-w-* en w-full
    <div
      ref={ref} // Koppel de ref voor click-outside
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden" // Positionering en breedte aangepast
    >
      <div className="max-h-[70vh] overflow-y-auto p-2"> {/* Iets meer max hoogte */}
        {categories.length === 0 ? (
           <p className='text-gray-500 text-center text-sm p-4'>All available sections have been added.</p>
        ) : (
          categories.map(category => {
            const isCategoryOpen = !!openCategories[category]; // Check of categorie open is
            return (
              <div key={category} className="mb-1 last:mb-0 border-b border-gray-100 last:border-b-0"> {/* Lijn tussen categorieën */}
                {/* Klikbare Categorie Titel */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex justify-between items-center px-2 py-2 text-left hover:bg-gray-50 rounded-t-md" // Style voor de klikbare header
                >
                  <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{category}</h5>
                  <LuChevronDown
                     className={`transform transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'} text-gray-400`}
                     size={16}
                  />
                </button>

                {/* Conditioneel weergeven van de opties */}
                {isCategoryOpen && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 pt-1 pb-2 px-2">
                    {groupedAvailableOptions[category].map((option) => {
                      const Icon = option.icon;
                      return (
                        <li key={option.type}>
                          <button
                            onClick={() => onSelectSection(option.type)}
                            className="w-full flex items-center p-2 text-left rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <span className="mr-3 text-gray-500 flex-shrink-0 w-5 h-5 flex items-center justify-center">
                               {Icon && <Icon size={18} />} {/* Iets kleiner icoon misschien */}
                            </span>
                            <span className="text-sm font-medium text-black truncate">{option.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

// Nodig voor forwardRef
AddSectionPopover.displayName = 'AddSectionPopover';

export default AddSectionPopover; 