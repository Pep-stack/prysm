'use client'; // Nodig voor hooks en interactie

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { supabase } from '../../../src/lib/supabase';
import { LuCircleUser, LuCreditCard, LuShieldCheck, LuTrash2, LuExternalLink, LuCrown, LuStar, LuZap } from "react-icons/lu";
import { SUBSCRIPTION_PLANS } from '../../../src/components/auth/SubscriptionSelector';
import { DesignSettingsProvider } from '../../../src/components/dashboard/DesignSettingsContext';

export default function AccountSettingsPage() {
  const { user, loading: sessionLoading } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        console.log('No user found, skipping subscription fetch');
        return;
      }

      console.log('Fetching subscription data for user:', user);
      console.log('User ID:', user?.id);

      try {
        // First check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          console.log('Profile data found:', Object.keys(data));
          console.log('Available columns:', Object.keys(data).join(', '));
        }

        if (error) {
          console.error('Error fetching subscription:', error);
          console.error('User ID:', user?.id);
          console.error('Error details:', JSON.stringify(error, null, 2));
        } else if (data) {
          console.log('Profile data loaded:', data);
          // Extract subscription data from profile
          const subscriptionData = {
            subscription_plan: data.subscription_plan || 'free',
            subscription_status: data.subscription_status || 'active',
            subscription_start_date: data.subscription_start_date,
            subscription_end_date: data.subscription_end_date,
            trial_end_date: data.trial_end_date,
            subscription_metadata: data.subscription_metadata || {}
          };
          console.log('Extracted subscription data:', subscriptionData);
          setSubscription(subscriptionData);
        } else {
          console.warn('No subscription data found for user:', user?.id);
          // Set default free plan if no data found
          setSubscription({
            subscription_plan: 'free',
            subscription_status: 'active',
            subscription_start_date: null,
            subscription_end_date: null,
            trial_end_date: null,
            subscription_metadata: {}
          });
        }
      } catch (err) {
        console.error('Error fetching subscription (catch):', err);
        console.error('User:', user);
        // Set default free plan on error
        setSubscription({
          subscription_plan: 'free',
          subscription_status: 'active',
          subscription_start_date: null,
          subscription_end_date: null,
          trial_end_date: null,
          subscription_metadata: {}
        });
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Function to refresh subscription data
  const refreshSubscriptionData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error refreshing subscription:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else if (data) {
        // Extract subscription data from profile
        const subscriptionData = {
          subscription_plan: data.subscription_plan || 'free',
          subscription_status: data.subscription_status || 'active',
          subscription_start_date: data.subscription_start_date,
          subscription_end_date: data.subscription_end_date,
          trial_end_date: data.trial_end_date,
          subscription_metadata: data.subscription_metadata || {}
        };
        setSubscription(subscriptionData);
      } else {
        console.warn('No subscription data found during refresh for user:', user?.id);
      }
    } catch (err) {
      console.error('Error refreshing subscription:', err);
    }
  };

  // Listen for subscription changes (optional: real-time updates)
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('profile-subscription-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Subscription updated:', payload);
          refreshSubscriptionData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Navigate to Stripe Billing Portal
  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe billing portal
    } catch (error) {
      console.error("Error creating billing portal session:", error);
      alert("Could not open billing portal. Please try again later.");
    }
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
  if (sessionLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
        <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[420px]">
          <h1 className="text-xl font-semibold text-black">Account Settings</h1>
          {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  // --- Pagina Content ---
  return (
    <DesignSettingsProvider initial={user}>
      <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
        <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[420px] space-y-6 pb-16 md:pb-0">
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
            <div className="text-sm space-y-1.5 sm:pl-8">
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
            <div className="text-sm space-y-3 sm:pl-8">
              {subscriptionLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : subscription ? (
                <>
                  {/* Plan Info with Icon */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500 w-28 inline-block">Current Plan:</span>
                    <div className="flex items-center gap-2">
                      {subscription.subscription_plan === 'pro' && <LuStar className="w-4 h-4 text-emerald-600" />}
                      {subscription.subscription_plan === 'business' && <LuZap className="w-4 h-4 text-blue-600" />}
                      {subscription.subscription_plan === 'free' && <LuCrown className="w-4 h-4 text-gray-600" />}
                      <span className="font-medium">
                        {SUBSCRIPTION_PLANS[subscription.subscription_plan]?.name || subscription.subscription_plan}
                      </span>
                      <span className="text-gray-500">
                        ({SUBSCRIPTION_PLANS[subscription.subscription_plan]?.price || 'Free'})
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500 w-28 inline-block">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      subscription.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                      subscription.subscription_status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                      subscription.subscription_status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                      subscription.subscription_status === 'canceled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.subscription_status === 'trialing' ? 'Trial' :
                       subscription.subscription_status === 'active' ? 'Active' :
                       subscription.subscription_status === 'past_due' ? 'Past Due' :
                       subscription.subscription_status === 'canceled' ? 'Canceled' :
                       subscription.subscription_status}
                    </span>
                  </div>

                  {/* Trial End Date */}
                  {subscription.trial_end_date && subscription.subscription_status === 'trialing' && (
                    <div>
                      <p>
                        <span className="font-medium text-gray-500 w-28 inline-block">Trial Ends:</span>
                        {new Date(subscription.trial_end_date).toLocaleDateString()}
                      </p>
                      {(() => {
                        const trialEndDate = new Date(subscription.trial_end_date);
                        const today = new Date();
                        const daysLeft = Math.ceil((trialEndDate - today) / (1000 * 60 * 60 * 24));
                        
                        if (daysLeft <= 3 && daysLeft > 0) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800">
                                ⚠️ Your trial expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. 
                                <button 
                                  onClick={() => window.location.href = '/checkout?plan=pro'}
                                  className="ml-1 text-yellow-900 underline hover:text-yellow-700"
                                >
                                  Upgrade now
                                </button> to continue using Pro features.
                              </p>
                            </div>
                          );
                        } else if (daysLeft <= 0) {
                          return (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-red-800">
                                🚨 Your trial has expired. 
                                <button 
                                  onClick={() => window.location.href = '/checkout?plan=pro'}
                                  className="ml-1 text-red-900 underline hover:text-red-700"
                                >
                                  Upgrade now
                                </button> to restore Pro features.
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  {/* Renewal Date */}
                  {subscription.subscription_end_date && (
                    <p>
                      <span className="font-medium text-gray-500 w-28 inline-block">
                        {subscription.subscription_status === 'active' ? 'Renews on:' : 'Expires on:'}
                      </span>
                      {new Date(subscription.subscription_end_date).toLocaleDateString()}
                    </p>
                  )}

                  {/* Upgrade/Manage Buttons */}
                  <div className="mt-4 flex gap-2">
                    {subscription.subscription_plan === 'free' && (
                      <button
                        onClick={() => window.location.href = '/checkout?plan=pro'}
                        className="inline-flex items-center gap-1.5 text-sm text-white bg-[#00C896] hover:bg-[#00A078] font-medium px-3 py-1.5 rounded-md transition-colors"
                      >
                        <LuStar className="w-3 h-3" />
                        Upgrade to Pro
                      </button>
                    )}
                    
                    {subscription.subscription_plan !== 'free' && (
                      <button
                        onClick={handleManageBilling}
                        className="inline-flex items-center gap-1.5 text-sm text-[#00C896] hover:text-[#00A078] font-medium group"
                      >
                        Manage Billing & Invoices
                        <LuExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
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
            <div className="text-sm space-y-2 sm:pl-8">
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
            <div className="text-sm space-y-3 sm:pl-8">
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
    </div>
    </DesignSettingsProvider>
  );
}
