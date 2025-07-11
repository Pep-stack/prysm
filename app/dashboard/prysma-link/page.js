'use client'; // Dit is een client component vanwege useState, useEffect, window, navigator

import React, { useState, useEffect } from 'react';
import { useSession } from '../../../src/components/auth/SessionProvider';
import { supabase } from '../../../src/lib/supabase';
import { LuCopy, LuCircleCheck, LuCheck, LuX } from 'react-icons/lu';

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
    const url = `${window.location.origin}/${slug}`;
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
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-20">
      <h1 className="text-2xl font-bold text-center mb-8">Your Prysma Link</h1>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your public link</label>
        <div className="flex items-center w-full max-w-md border-2 border-[#00C896] rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#00C896] gap-2">
          <span className="text-gray-500 text-base select-none">prysma.com/</span>
          {editing ? (
            <>
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
                className="flex-1 px-2 py-1 bg-transparent outline-none text-base text-gray-900 min-w-0"
                autoFocus
              />
              {slugStatus === 'checking' && <LuCircleCheck className="text-gray-400 animate-spin" size={18} />}
              {slugStatus === 'available' && <LuCheck className="text-green-600" size={18} />}
              {slugStatus === 'taken' && <LuX className="text-red-600" size={18} />}
              <button
                onClick={saveSlug}
                disabled={slugStatus === 'checking' || slugStatus === 'taken' || !slugInput || slugError}
                className="px-3 py-1 text-sm bg-[#00C896] text-white rounded-md hover:bg-[#00A078] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ minWidth: 60 }}
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setSlugInput(slug); setSlugError(''); }}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md"
                style={{ minWidth: 60 }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-base text-gray-900 font-medium truncate">{slug}</span>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                style={{ minWidth: 60 }}
              >
                Edit
              </button>
            </>
          )}
          <button
            onClick={copyToClipboard}
            className={`flex items-center px-2 py-1 rounded-md transition-colors ${copySuccess ? 'bg-[#E6F9F4] text-[#00C896]' : 'bg-white text-[#00C896] hover:bg-gray-100'}`}
            aria-label={copySuccess ? 'Copied!' : 'Copy link'}
            style={{ minWidth: 36 }}
          >
            {copySuccess ? <LuCircleCheck size={18} /> : <LuCopy size={16} />}
          </button>
        </div>
        {slugError && <p className="text-xs text-red-600 mt-2 w-full text-left">{slugError}</p>}
        {slugStatus === 'saved' && <p className="text-xs text-green-600 mt-2 w-full text-left">Saved!</p>}
      </div>
    </div>
  );
}
