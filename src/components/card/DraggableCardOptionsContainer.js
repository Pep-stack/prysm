'use client';

import React from 'react';
import DraggableCardOption from './DraggableCardOption'; // Import the component we just created

// Define available options here or import them
// Ensure this list is consistent with options used elsewhere (e.g., PrysmaCard rendering logic)
const availableCardOptions = [
    { id: 'bio', name: 'Bio Section', inputType: 'textarea' },
    { id: 'skills', name: 'Skills Section', inputType: 'text', placeholder: 'Comma-separated, e.g., React, Node.js' },
    // Assuming 'contact' is not meant to be draggable based on inputType 'none' filter later?
    // { id: 'contact', name: 'Contact Section', inputType: 'none' },
    { id: 'location', name: 'Location Section', inputType: 'text' },
    { id: 'website', name: 'Website Section', inputType: 'text' },
    // Add other potential sections if they exist and should be draggable options
];


// Accept cardSections as a prop
export default function DraggableCardOptionsContainer({ cardSections = [] }) {
    // Get the IDs of sections currently on the card
    const sectionsOnCardIds = new Set(cardSections.map(section => section.id));

    // Filter available options: show only those NOT on the card and not 'none' inputType
    const filteredOptions = availableCardOptions.filter(option => {
        const isOnCard = sectionsOnCardIds.has(option.id);
        const isDraggableType = option.inputType !== 'none';
        return isDraggableType && !isOnCard;
    });


    return (
        <div className="space-y-2">
            {/* Removed the "Available Sections" text as it's now implicit or handled by parent */}
            {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                    // Ensure DraggableCardOption handles the 'option' prop correctly
                    <DraggableCardOption key={option.id} option={option} />
                ))
            ) : (
                <p className="text-sm text-gray-500 italic">All sections added.</p>
            )}
        </div>
    );
} 