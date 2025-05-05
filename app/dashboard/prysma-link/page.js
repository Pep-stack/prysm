'use client'; // Dit is een client component vanwege useState, useEffect, window, navigator

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider'; // Controleer/pas pad aan
import { LuCopy, LuCircleCheck } from 'react-icons/lu'; // Iconen voor kopieerknop

export default function PrysmaLinkPage() {
  const { user, loading: sessionLoading } = useSession(); // Haal user data op
  const [profileUrl, setProfileUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Extra loading state

  // Effect om de URL samen te stellen zodra we de user ID hebben
  useEffect(() => {
    // Wacht tot de sessie geladen is EN we een user ID hebben
    if (!sessionLoading && user?.id && typeof window !== 'undefined') {
      // Stel de URL samen. BELANGRIJK: pas '/p/' aan als je publieke route anders is!
      setProfileUrl(`${window.location.origin}/p/${user.id}`);
      setIsLoading(false); // Stop met laden
    } else if (!sessionLoading && !user) {
      // Als sessie geladen is maar er geen user is (onwaarschijnlijk hier door layout redirect)
      setIsLoading(false);
    }
  }, [sessionLoading, user?.id]); // Afhankelijk van loading state en user ID

  // Functie om de URL naar het klembord te kopiëren
  const copyToClipboard = () => {
    if (!profileUrl || !navigator.clipboard) return; // Check of clipboard API beschikbaar is

    navigator.clipboard.writeText(profileUrl).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500); // Reset na 2.5 seconden
      },
      (err) => {
        console.error('Failed to copy profile link: ', err);
        alert('Could not copy link automatically. Please select and copy manually.'); // Fallback
      }
    );
  };

  // Toon loading state indien nodig
  if (isLoading) {
    return (
      // Compactere container
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold text-black mb-4">Your Prysma Link</h1>
        {/* Loading Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Toon de pagina inhoud
  return (
    // Smallere container voor een strakker gevoel
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-black">Your Prysma Link</h1>

      {/* "Grouped" card styling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Padding binnen de card */}
        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-sm text-gray-600">
            Share this link to grant access to your Prysma profile.
          </p>

          {profileUrl ? (
            // Container voor link en knop
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#00C896] focus-within:ring-opacity-50 transition-shadow duration-150">
              {/* Link (neemt meeste ruimte) - geen input, maar gestylde div */}
              <span
                className="flex-1 px-3 py-2.5 text-sm text-gray-800 bg-white truncate" // truncate voorkomt overflow
                aria-label="Your Prysma profile link"
              >
                {profileUrl}
              </span>

              {/* Dunne scheidingslijn */}
              <div className="w-px h-6 bg-gray-300 self-center"></div>

              {/* Kopieerknop - Compacter, primaire kleur */}
              <button
                onClick={copyToClipboard}
                disabled={!navigator.clipboard}
                className={`flex-shrink-0 flex items-center justify-center px-3 py-2.5 transition-colors duration-150 ease-in-out focus:outline-none ${
                  copySuccess
                    ? 'bg-[#E6F9F4] text-[#00C896]' // Accentkleur (licht) voor succes
                    : 'bg-white text-[#00C896] hover:bg-gray-50' // Accentkleur als tekst, lichte hover
                }`}
                aria-label={copySuccess ? 'Copied!' : 'Copy link'}
              >
                {copySuccess ? (
                  <LuCircleCheck size={20} /> // Iets groter icoon bij succes
                ) : (
                  <LuCopy size={18} />
                )}
              </button>
            </div>
          ) : (
            <p className="text-sm text-red-600">Could not generate link.</p>
          )}

           {/* Feedback bericht (optioneel, onder de box) */}
           <div className="h-4 text-right"> {/* Vaste hoogte */}
              {copySuccess && (
                  <p className="text-xs text-[#00A078]">Copied!</p>
              )}
           </div>

        </div>
      </div>

      {/* Optionele Extra Sectie (bijv. voor QR code preview) */}
      {/*
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
          <h2 className="text-base font-medium text-black mb-3">QR Code</h2>
          <p className="text-sm text-gray-600 mb-4">
            Or share visually using this QR code.
          </p>
          {/* Placeholder for QR Code Component */}
      {/*    <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500">
              QR Code Here
            </div>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
