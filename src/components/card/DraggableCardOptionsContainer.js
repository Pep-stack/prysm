'use client';

import React from 'react';
import DraggableCardOption from './DraggableCardOption'; // Import the component we just created
import { useOpenCategories } from '../../hooks/useOpenCategories';

// RESTRUCTURED: Define options within categories
const categorizedOptions = [
  {
    category: 'Core Information',
    options: [
      { id: 'bio', name: 'Bio Section', inputType: 'textarea' },
      { id: 'skills', name: 'Skills Section', inputType: 'text', placeholder: 'Comma-separated, e.g., React, Node.js' },
      { id: 'website', name: 'Website Section', inputType: 'text' },
    ]
  },
  {
    category: 'Professional Background',
    options: [
      { id: 'experience', name: 'Experience / Work History', inputType: 'none' },
      { id: 'education', name: 'Education', inputType: 'none' },
      { id: 'certifications', name: 'Certifications & Licenses', inputType: 'none', editorComponent: 'CertificationSelector' },
      { id: 'projects', name: 'Projects & Portfolio', inputType: 'none', editorComponent: 'ProjectSelector' },
      { id: 'publications', name: 'Publications / Media', inputType: 'textarea' },
      { id: 'events', name: 'Events', inputType: 'textarea' },
      { id: 'awards', name: 'Awards & Achievements', inputType: 'textarea' },
      { id: 'languages', name: 'Languages', inputType: 'text', editorComponent: 'LanguageSelector' },
      { id: 'services', name: 'Services Offered', inputType: 'textarea' },
      { id: 'testimonials', name: 'Testimonials / Recommendations', inputType: 'none' },
    ]
  },
  {
    category: 'Contact & Interaction',
    options: [
      { id: 'calendar_scheduling', name: 'Calendar / Scheduling', inputType: 'none' },
      { id: 'newsletter_signup', name: 'Newsletter Signup', inputType: 'none' },
    ]
  },
  {
    category: 'Social Profiles',
    options: [
      { id: 'linkedin', name: 'LinkedIn Profile', inputType: 'text', placeholder: 'Enter your LinkedIn profile URL' },
      { id: 'x', name: 'X Profile', inputType: 'text', placeholder: 'Enter your X profile URL' },
      { id: 'instagram', name: 'Instagram Profile', inputType: 'text', placeholder: 'Enter your Instagram profile URL' },
      { id: 'github', name: 'GitHub', inputType: 'text', placeholder: 'Enter your GitHub profile URL' },
      { id: 'dribbble', name: 'Dribbble', inputType: 'text', placeholder: 'Enter your Dribbble profile URL' },
      { id: 'youtube', name: 'YouTube Channel', inputType: 'text', placeholder: 'Enter channel URL' },
      { id: 'tiktok', name: 'TikTok Profile', inputType: 'text', placeholder: 'Enter profile URL' },
      { id: 'facebook', name: 'Facebook Profile', inputType: 'text', placeholder: 'Enter profile URL' },
      { id: 'snapchat', name: 'Snapchat Profile', inputType: 'text', placeholder: 'Enter profile URL' },
      { id: 'reddit', name: 'Reddit Profile', inputType: 'text', placeholder: 'Enter profile URL' },
  
      { id: 'whatsapp', name: 'WhatsApp', inputType: 'text', placeholder: 'Enter WhatsApp number' },
      { id: 'behance', name: 'Behance', inputType: 'text', placeholder: 'Enter your Behance profile URL' },
    ]
  },
  {
    category: 'Location & Availability',
    options: [
      { id: 'location', name: 'Location Section', inputType: 'text' },
      { id: 'google_maps', name: 'Google Maps Location', inputType: 'none' },
      { id: 'timezone_hours', name: 'Timezone & Opening Hours', inputType: 'text' },
    ]
  },
  {
    category: 'Utilities & Extras',
    options: [

      { id: 'statistics_proof', name: 'Statistics / Social Proof', inputType: 'none' },
      { id: 'blog_articles', name: 'Blog / Articles', inputType: 'none' },
      { id: 'video_banner', name: 'Video Banner / Intro', inputType: 'none' },
    ]
  },
];

// Accept cardSections as a prop
export default function DraggableCardOptionsContainer({ cardSections = [] }) {
    // Get the IDs of sections currently on the card
    const sectionsOnCardIds = new Set(cardSections.map(section => section.id));

    // ADDED: State to track open categories (default all open)
    const { openCategories, setOpenCategories, toggleCategory } = useOpenCategories();

    // UPDATED: Rendering logic to handle categories and toggling
    return (
        <div className="space-y-2"> {/* Adjusted spacing slightly */}
            {categorizedOptions.map((categoryGroup) => {
                // Filter options within this category that are not already on the card
                const filteredOptions = categoryGroup.options.filter(option => {
                    return !sectionsOnCardIds.has(option.id);
                });

                // Only render the category group if there are options available in it
                if (filteredOptions.length > 0) {
                    const isOpen = openCategories[categoryGroup.category];
                    return (
                        <div key={categoryGroup.category} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                            {/* Make category title clickable */}
                            <button 
                                onClick={() => toggleCategory(categoryGroup.category)}
                                className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-600 mb-2 focus:outline-none"
                            >
                                <span>{categoryGroup.category}</span>
                                {/* Simple arrow indicator */}
                                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                            </button>
                            {/* Conditionally render options based on open state */}
                            {isOpen && (
                                <div className="space-y-2 pl-1 sm:pl-2"> {/* Indent options slightly */}
                                    {filteredOptions.map(option => (
                                        <DraggableCardOption key={option.id} option={option} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }
                return null; // Don't render category if no options available
            })}

            {/* Check if ALL options from ALL categories are on the card */}
            {categorizedOptions.every(group => group.options.every(opt => sectionsOnCardIds.has(opt.id))) && (
                 <p className="text-sm text-gray-500 italic">All sections added.</p>
            )}
        </div>
    );
} 