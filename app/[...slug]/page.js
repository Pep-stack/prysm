import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PrysmaCard from '../../src/components/card/PrysmaCard';
import { DesignSettingsProvider } from '../../src/components/dashboard/DesignSettingsContext';
import PublicProfilePageContent from '../p/[id]/PublicProfilePageContent';

// Function to fetch profile by custom domain or slug
async function getProfileByDomainOrSlug(slug) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // First try to find by custom domain
  const { data: domainProfile, error: domainError } = await supabase
    .from('profiles')
    .select('*, user_id:id')
    .eq('custom_domain', slug)
    .eq('domain_verified', true)
    .single();

  if (domainProfile) {
    return domainProfile;
  }

  // If not found by domain, try by custom slug
  const { data: slugProfile, error: slugError } = await supabase
    .from('profiles')
    .select('*, user_id:id')
    .eq('custom_slug', slug)
    .single();

  if (slugProfile) {
    return slugProfile;
  }

  // If not found by slug, try by user ID (fallback to original behavior)
  const { data: idProfile, error: idError } = await supabase
    .from('profiles')
    .select('*, user_id:id')
    .eq('id', slug)
    .single();

  if (idProfile) {
    return idProfile;
  }

  return null;
}

// This page handles custom domains and custom slugs
export default async function CustomDomainPage({ params }) {
  const slug = params.slug?.[0]; // Get the first part of the slug array
  
  if (!slug) {
    notFound();
  }

  let profile = null;
  let error = null;

  try {
    profile = await getProfileByDomainOrSlug(slug);
  } catch (err) {
    error = err.message || 'Failed to load profile.';
    console.error(err);
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!profile) {
    notFound();
  }

  // Ensure card_sections is an array
  const cardSections = Array.isArray(profile.card_sections) ? profile.card_sections : [];

  return (
    <DesignSettingsProvider initial={profile}>
      <PublicProfilePageContent profile={profile} cardSections={cardSections} />
    </DesignSettingsProvider>
  );
} 