'use client';

import React from 'react';
import { useOpenCategories } from '../../hooks/useOpenCategories';
// Importeer de opties en de grouping functie (of alleen options als je niet groepeert)
import { getGroupedSectionOptions, CATEGORY_ICONS, CARD_TYPES } from '../../lib/sectionOptions';
// Iconen worden nu hier direct gebruikt
// import { getIconForSection } from '../../lib/sectionIcons'; // Niet meer nodig als icon in options zit
import { LuChevronDown } from "react-icons/lu";

export default function AvailableSectionList({ onAddSection, existingSectionTypes = [], cardType = CARD_TYPES.PRO }) {
  console.log('🟢 COMPONENT: AvailableSectionList rendered with onAddSection:', typeof onAddSection);
  const { openCategories, setOpenCategories, toggleCategory } = useOpenCategories();
  // console.log("Initial openCategories:", openCategories); // Vorige debug log

  // Gebruik de grouping functie met card type
  const groupedAvailableOptions = getGroupedSectionOptions(existingSectionTypes, cardType);
  const categories = Object.keys(groupedAvailableOptions);

  if (categories.length === 0) {
    return (
      <div className="p-4 mb-6 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        All available sections have been added.
      </div>
    );
  }

  return (
    // Container voor de lijst met beschikbare secties
    <div className="p-4 mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-md font-semibold text-black mb-4">Add Content</h3>
      <div className="space-y-1">
        {categories.map(category => {
          const isCategoryOpen = !!openCategories[category];
          // Haal het icoon op voor deze categorie
          const CategoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['Other']; // Gebruik fallback

          // --- DEBUG LOG ---
          // Log de categorie en het gevonden icoon component
          console.log(`Rendering Category: "${category}", Found Icon Component:`, CategoryIcon);
          // --- EINDE DEBUG LOG ---

          return (
            <div key={category} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center p-2 text-left hover:bg-gray-50 rounded-md"
              >
                {/* Groep voor icoon en titel */}
                <div className="flex items-center gap-2"> {/* Zorg dat gap werkt */}
                   {/* Render het Categorie Icoon */}
                   {CategoryIcon && <CategoryIcon className="text-gray-500" size={16} />}
                   <h5 className="text-sm font-medium text-gray-700">{category}</h5>
                </div>
                {/* Pijl icoon */}
                <LuChevronDown
                   className={`transform transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'} text-gray-400`}
                   size={18}
                />
              </button>

              {/* Conditionele rendering van opties grid (blijft hetzelfde) */}
              {isCategoryOpen && (
                <div className="pt-2 pb-3 px-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {groupedAvailableOptions[category].map((option) => {
                      const SectionIcon = option.icon;
                      return (
                        <button
                          key={option.type}
                          onClick={(e) => {
                            console.log('🔴 BUTTON-CLICK: Add section button clicked for type:', option.type);
                            console.log('🔴 BUTTON-CLICK: Event target:', e.target);
                            console.log('🔴 BUTTON-CLICK: onAddSection function:', onAddSection);
                            if (typeof onAddSection === 'function') {
                              onAddSection(option.type);
                            } else {
                              console.error('🔴 BUTTON-CLICK: onAddSection is not a function!');
                            }
                          }}
                          disabled={existingSectionTypes.includes(option.type)}
                          className="flex flex-col items-center justify-center p-3 text-center rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors h-20"
                          style={{ pointerEvents: 'auto', zIndex: 1 }}
                        >
                          <span className="text-gray-600 mb-1">
                             {SectionIcon && <SectionIcon size={20} />}
                          </span>
                          <span className="text-xs font-medium text-black leading-tight">{option.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 