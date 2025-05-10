'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider'; // Controleer dit pad
import { QRCodeCanvas } from 'qrcode.react'; // Controleer of 'qrcode.react' is geïnstalleerd
import { LuDownload } from "react-icons/lu";

// Zorg ervoor dat de functie correct wordt geëxporteerd
export default function QRCodePage() {
  const { user, loading: sessionLoading } = useSession();
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Effect om de profiel URL samen te stellen
  useEffect(() => {
    if (!sessionLoading && user?.id && typeof window !== 'undefined') {
      // BELANGRIJK: pas '/p/' aan als je publieke route anders is!
      setProfileUrl(`${window.location.origin}/p/${user.id}`);
      setIsLoading(false);
    } else if (!sessionLoading && !user) {
      // Geen gebruiker gevonden na het laden
      setIsLoading(false);
    }
  }, [sessionLoading, user?.id]); // Afhankelijkheden van het effect

  // Functie om de QR code als PNG te downloaden
  const handleDownload = () => {
    const canvas = document.getElementById('prysma-qrcode-canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream'); // Forceert download
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'prysma-qr-code.png'; // Bestandsnaam
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink); // Ruim de link op
    } else {
        console.error("QR Code Canvas element not found with ID: prysma-qrcode-canvas");
        alert("Could not initiate download. QR code element not found.");
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
        <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[420px] space-y-6">
          <h1 className="text-xl font-semibold text-black mb-4">Your QR Code</h1>
          {/* Loading Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5 animate-pulse">
              <div className="flex flex-col items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 self-start"></div>
                <div className="w-48 h-48 bg-gray-200 rounded-md"></div> {/* QR Placeholder */}
                <div className="h-10 bg-gray-200 rounded w-1/2 mt-1"></div> {/* Button Placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Pagina Content ---
  return (
    <div className="flex justify-center px-4 max-w-screen-lg mx-auto pb-16 md:pb-0">
      <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[420px] space-y-6">
        <h1 className="text-xl font-semibold text-black">Your QR Code</h1>
        {/* QR Code Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-5 space-y-5">
            <p className="text-sm text-gray-600 text-center">
              Scan this code or download it to share your Prysma profile visually.
            </p>
            {profileUrl ? (
              <div className="flex flex-col items-center gap-5">
                {/* Container voor QR code met padding/border */}
                <div className="p-2 bg-white inline-block rounded-md border border-gray-200 shadow-inner">
                  <QRCodeCanvas
                    id="prysma-qrcode-canvas"
                    value={profileUrl}
                    size={192}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                {/* Download Knop */}
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#00C896] text-white hover:bg-[#00A078] focus:ring-[#00C896]"
                  aria-label="Download QR Code"
                >
                  <LuDownload size={16} />
                  Download QR Code
                </button>
              </div>
            ) : (
              <p className="text-sm text-red-600 text-center">
                Could not generate QR code. User profile information might be missing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} // Zorg ervoor dat de functie correct wordt afgesloten met '}' 