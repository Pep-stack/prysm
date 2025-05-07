'use client'; // Nodig voor hooks en interactie

import React from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider'; // Pas pad aan indien nodig
import { LuCircleUser, LuCreditCard, LuShieldCheck, LuTrash2, LuExternalLink } from "react-icons/lu"; // Iconen

export default function AccountSettingsPage() {
  const { user, loading: sessionLoading } = useSession();

  // --- Placeholder Data (VERVANG DIT met echte data fetching) ---
  // Haal deze gegevens op van je backend/database/Stripe
  const subscription = {
    planName: 'Pro Plan', // Voorbeeld
    status: 'Active', // Voorbeeld: Active, Trial, Canceled, Past Due
    renewalDate: 'December 31, 2024', // Voorbeeld formaat
    isLoading: false, // Zet op true tijdens het laden van abonnement data
  };
  // --- Einde Placeholder Data ---

  // Placeholder Functie: Navigeer naar Stripe Billing Portal
  const handleManageBilling = async () => {
    alert("Navigating to Billing Portal (Backend integration required)");
    // VOORBEELD Backend Call:
    // try {
    //   const response = await fetch('/api/stripe/create-portal-session'); // Je API route
    //   if (!response.ok) throw new Error('Failed to create portal session');
    //   const { url } = await response.json();
    //   window.location.href = url; // Redirect naar Stripe
    // } catch (error) {
    //   console.error("Error creating billing portal session:", error);
    //   alert("Could not open billing portal. Please try again later.");
    // }
  };

  // Placeholder Functie: Wachtwoord wijzigen
  const handleChangePassword = () => {
      alert("Change Password functionality (Backend integration required)");
      // Idealiter link je naar een aparte pagina of modal voor wachtwoordwijziging
  };

   // Placeholder Functie: Account verwijderen
   const handleDeleteAccount = () => {
    // Extra bevestiging
    if (confirm("Are you absolutely sure you want to delete your account?\nThis action is permanent and cannot be undone.")) {
        alert("Account Deletion (Backend integration required)");
        // VOORBEELD Backend Call:
        // try {
        //    await fetch('/api/user/delete', { method: 'DELETE' }); // Je API route
        //    // Log gebruiker uit na succesvolle verwijdering
        //    signOut({ callbackUrl: '/' });
        // } catch (error) {
        //    console.error("Error deleting account:", error);
        //    alert("Could not delete account. Please try again later.");
        // }
        console.log("Initiating account deletion...");
    }
  };

  // --- Loading State ---
  if (sessionLoading || subscription.isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="text-xl font-semibold text-black">Account Settings</h1>
        {/* Loading Skeleton Cards */}
        {[...Array(3)].map((_, i) => ( // Toon 3 loading cards
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
               <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Pagina Content ---
  return (
    // Gebruik max-w-full op mobiel, sm:max-w-2xl op grotere schermen
    <div className="w-full max-w-full sm:max-w-2xl mx-auto space-y-6 pb-16 md:pb-0">
      <h1 className="text-xl font-semibold text-black">Account Settings</h1>

      {/* --- Account Informatie Card --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
          {/* Header met icoon */}
          <div className="flex items-center gap-3 mb-3 text-gray-700">
             <LuCircleUser className="w-5 h-5 flex-shrink-0" />
             <h2 className="text-base font-medium text-black">Account Information</h2>
          </div>
          {/* Details */}
          <div className="text-sm space-y-1.5 pl-8"> {/* Inspringen voor details */}
             <p><span className="font-medium text-gray-500 w-16 inline-block">Email:</span> {user?.email || 'N/A'}</p>
             {/* Voeg hier evt. naam of andere details toe die in 'user' zitten */}
             {/* <p><span className="font-medium text-gray-500 w-16 inline-block">Name:</span> {user?.name || 'N/A'}</p> */}
          </div>
        </div>
      </div>

      {/* --- Subscription Card --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
           {/* Header */}
           <div className="flex items-center gap-3 mb-3 text-gray-700">
              <LuCreditCard className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Subscription</h2>
           </div>
           {/* Details */}
           <div className="text-sm space-y-2 pl-8">
              {subscription ? (
                <>
                  <p><span className="font-medium text-gray-500 w-28 inline-block">Current Plan:</span> {subscription.planName}</p>
                  <p className="flex items-center">
                     <span className="font-medium text-gray-500 w-28 inline-block">Status:</span>
                     {/* Dynamische status badge */}
                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                         subscription.status === 'Active' ? 'bg-green-100 text-green-800' :
                         subscription.status === 'Trial' ? 'bg-blue-100 text-blue-800' :
                         'bg-gray-100 text-gray-800' // Default/Canceled/Etc.
                     }`}>
                        {subscription.status}
                     </span>
                  </p>
                  <p><span className="font-medium text-gray-500 w-28 inline-block">Renews on:</span> {subscription.renewalDate}</p>
                  {/* Knop om facturering te beheren */}
                  <button
                      onClick={handleManageBilling}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#00C896] hover:text-[#00A078] font-medium group"
                  >
                      Manage Billing & Invoices
                      <LuExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                </>
              ) : (
                <p className="text-gray-500">Subscription details not available.</p>
              )}
           </div>
        </div>
      </div>

       {/* --- Security Card --- */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
           {/* Header */}
           <div className="flex items-center gap-3 mb-3 text-gray-700">
              <LuShieldCheck className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium text-black">Security</h2>
           </div>
           {/* Acties */}
           <div className="text-sm space-y-2 pl-8">
              <button
                  onClick={handleChangePassword}
                  className="text-sm text-[#00C896] hover:text-[#00A078] font-medium"
              >
                  Change Password
              </button>
              {/* Voeg hier eventueel 2FA instellingen toe */}
              {/* <p className="text-gray-500">Two-Factor Authentication: Disabled</p> */}
           </div>
        </div>
      </div>

      {/* --- Danger Zone Card --- */}
      <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-5">
           {/* Header */}
           <div className="flex items-center gap-3 mb-3 text-red-600">
              <LuTrash2 className="w-5 h-5 flex-shrink-0" />
              <h2 className="text-base font-medium">Danger Zone</h2>
           </div>
           {/* Acties */}
           <div className="text-sm space-y-3 pl-8">
               <p className="text-red-700">
                  Deleting your account will permanently remove all your profile data and cannot be undone.
               </p>
               <button
                    onClick={handleDeleteAccount}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                    Delete My Account Permanently
                </button>
           </div>
        </div>
      </div>

    </div>
  );
}
