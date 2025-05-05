import React from 'react';
import Sidebar from '../../src/components/dashboard/Sidebar'; // Maak dit component aan!
// Importeer eventueel een DashboardHeader component

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100"> {/* Achtergrond voor hele dashboard view */}
      <Sidebar /> {/* Plaats je Sidebar component */}

      {/* Main content area wrapper - VOEG md:ml-64 TOE */}
      <div className="flex-1 flex flex-col md:ml-64"> {/* ml = margin-left */}
        {/* Optioneel: Dashboard-specifieke header */}
        {/* <DashboardHeader /> */}

        {/* Content van de huidige pagina (page.js) */}
        <main className="flex-1 pb-16 md:pb-0 p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
} 