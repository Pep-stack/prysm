'use client'; // Dit is een client component vanwege useState, useEffect, window, navigator

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { supabase } from '../../../src/lib/supabase';
import { LuCopy, LuCircleCheck, LuCheck, LuX, LuGlobe, LuPencil } from 'react-icons/lu';

export default function PrysmaLinkPage() {
  const { user, loading: sessionLoading } = useSession();
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState(false);
  const [slugInput, setSlugInput] = useState('');
  const [slugStatus, setSlugStatus] = useState('idle'); // idle, checking, available, taken, saved
  const [slugError, setSlugError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Laad de huidige slug
  useEffect(() => {
    if (!sessionLoading && user?.id) {
      const loadSlug = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('custom_slug')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          setSlug(data.custom_slug || '');
          setSlugInput(data.custom_slug || '');
        }
        setIsLoading(false);
      };
      loadSlug();
    }
  }, [sessionLoading, user?.id]);

  // Slug validatie
  const validateSlug = (value) => {
    return /^[a-z0-9-]{3,}$/.test(value);
  };

  // Check beschikbaarheid
  const checkSlugAvailability = async (value) => {
    setSlugStatus('checking');
    setSlugError('');
    if (!validateSlug(value)) {
      setSlugStatus('idle');
      setSlugError('Use only lowercase letters, numbers, hyphens (min 3 chars)');
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_slug', value)
      .neq('id', user.id)
      .single();
    if (!error && data) {
      setSlugStatus('taken');
      setSlugError('This username is already taken.');
    } else {
      setSlugStatus('available');
      setSlugError('');
    }
  };

  // Opslaan van slug
  const saveSlug = async () => {
    if (!validateSlug(slugInput)) {
      setSlugError('Use only lowercase letters, numbers, hyphens (min 3 chars)');
      return;
    }
    setSlugStatus('checking');
    const { error } = await supabase
      .from('profiles')
      .update({ custom_slug: slugInput, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (!error) {
      setSlug(slugInput);
      setSlugStatus('saved');
      setEditing(false);
      setSlugError('');
    } else {
      setSlugStatus('idle');
      setSlugError('Failed to save username.');
    }
  };

  // Kopieer naar klembord
  const copyToClipboard = () => {
    const url = `https://useprysma.com/${slug}`;
    if (!url || !navigator.clipboard) return;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        alert('Could not copy link automatically. Please select and copy manually.');
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
        <div className="w-full sm:w-[400px] md:w-[500px] space-y-6 pt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fullUrl = `https://useprysma.com/${slug}`;

  return (
    <div className="flex justify-center px-4 max-w-screen-lg mx-auto">
      <div className="w-full sm:w-[400px] md:w-[500px] space-y-6 pt-6">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <LuGlobe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Your Prysma Link</h1>
                <p className="text-sm text-gray-500">Share your professional profile</p>
              </div>
            </div>

            {/* URL Display/Edit */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your public link
                </label>
                
                {editing ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                        <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300 select-none">
                          useprysma.com/
                        </span>
                        <input
                          type="text"
                          value={slugInput}
                          onChange={e => {
                            setSlugInput(e.target.value.replace(/[^a-z0-9-]/g, ''));
                            setSlugStatus('idle');
                            setSlugError('');
                          }}
                          onBlur={() => checkSlugAvailability(slugInput)}
                          placeholder="your-name"
                          className="flex-1 px-3 py-3 text-sm bg-white outline-none"
                          autoFocus
                        />
                        <div className="px-3 py-3 border-l border-gray-300">
                          {slugStatus === 'checking' && <LuCircleCheck className="text-gray-400 animate-spin" size={16} />}
                          {slugStatus === 'available' && <LuCheck className="text-emerald-600" size={16} />}
                          {slugStatus === 'taken' && <LuX className="text-red-600" size={16} />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Error/Success Messages */}
                    {slugError && (
                      <p className="text-sm text-red-600">{slugError}</p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={saveSlug}
                        disabled={slugStatus === 'checking' || slugStatus === 'taken' || !slugInput || slugError}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {slugStatus === 'checking' ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => { 
                          setEditing(false); 
                          setSlugInput(slug); 
                          setSlugError(''); 
                          setSlugStatus('idle');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-emerald-800 truncate">
                          {fullUrl}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-3">
                                                 <button
                           onClick={() => setEditing(true)}
                           className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                           title="Edit link"
                         >
                           <LuPencil size={16} />
                         </button>
                        <button
                          onClick={copyToClipboard}
                          className={`p-2 rounded-lg transition-colors ${
                            copySuccess 
                              ? 'text-emerald-600 bg-emerald-100' 
                              : 'text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={copySuccess ? 'Copied!' : 'Copy link'}
                        >
                          {copySuccess ? <LuCheck size={16} /> : <LuCopy size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {slugStatus === 'saved' && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <LuCheck size={16} />
                        <span>Link updated successfully!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Customize your link</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use only lowercase letters, numbers, and hyphens</li>
                <li>• Minimum 3 characters required</li>
                <li>• Choose something memorable and professional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
