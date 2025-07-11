'use client'; // Waarschijnlijk nodig voor hooks zoals usePathname, useSession

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from '../auth/SessionProvider';
import { LuLayoutDashboard, LuCircleUser, LuLink, LuQrCode, LuSettings, LuLogOut, LuGlobe } from "react-icons/lu"; // Lucide icons (strak)

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useSession();

  const handleSignOut = async () => {
     try {
        await signOut();
        // Redirect gebeurt meestal via SessionProvider of een effect
     } catch (error) {
        console.error('Error signing out:', error);
     }
  };

  // Definieer navigatie-items voor hergebruik
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: LuCircleUser },
    { href: '/dashboard/prysma-link', label: 'Prysma Link', icon: LuLink }, // Pas href aan indien nodig
    { href: '/dashboard/qr-code', label: 'QR Code', icon: LuQrCode }, // Pas href aan indien nodig
    { href: '/dashboard/account', label: 'Account Settings', icon: LuSettings }, // Pas href aan indien nodig
  ];

  // Helper functie voor link klassen
  const getLinkClassName = (href, isMobile = false) => {
    const isActive = pathname === href;
    if (isMobile) {
      // Mobiele styling: focus op icoon kleur
      return `flex flex-col items-center justify-center p-2 rounded-md transition-colors ${isActive ? 'text-[#00C896]' : 'text-gray-500 hover:text-[#00C896]'}`;
    } else {
      // Desktop styling: achtergrond + tekst kleur
      return `flex items-center p-2.5 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-[#00C896] text-white' : 'text-black hover:bg-gray-100'}`;
    }
  };

  return (
    <>
      {/* --- Desktop Sidebar (Hidden on small screens) --- */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
         <div className="flex flex-col flex-grow bg-white pt-5 overflow-y-auto border-r border-gray-200 shadow-sm">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
               <Link href="/">
                  <Image src="/images/logo.png" alt="Prysma" width={120} height={40} />
               </Link>
            </div>

            {/* Navigatie Links */}
            <nav className="flex-1 px-2 space-y-1">
               {navItems.map((item) => (
               <Link key={item.href} href={item.href} className={getLinkClassName(item.href)}>
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                  {item.label}
               </Link>
               ))}
            </nav>

            {/* User Info / Sign Out */}
            <div className="flex-shrink-0 px-4 pb-4 mt-auto">
               {/* Divider */}
               <div className="h-px bg-gray-200 mb-4"></div>
               {user && (
                  <div className="mb-3 text-center">
                     <p className="text-xs text-gray-500">Logged in as</p>
                     <p className="text-sm font-medium text-black truncate">{user.email}</p>
                  </div>
               )}
               <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm"
               >
                  <LuLogOut className="mr-2 h-4 w-4" />
                  Sign Out
               </button>
            </div>
         </div>
      </div>

      {/* --- Mobile Bottom Navigation Bar (Visible only on small screens) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] flex justify-around items-center z-50">
         {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClassName(item.href, true)}>
               <item.icon className="h-6 w-6" aria-hidden="true" />
               {/* Optioneel: Toon label op mobiel (kan druk worden) */}
               {/* <span className="text-xs mt-1">{item.label}</span> */}
            </Link>
         ))}
      </div>

       {/* --- Add Padding to Main Content to offset fixed sidebar/navbar --- */}
       {/* This needs to be applied in the layout.js or page.js that USES the sidebar */}
       {/* Example (adjust padding values as needed): */}
       {/* Desktop: <main className="md:pl-64 ...">...</main> */}
       {/* Mobile: <main className="pb-16 md:pb-0 ...">...</main> */}

    </>
  );
} 