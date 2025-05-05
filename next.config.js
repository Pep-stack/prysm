/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... eventuele andere configuraties die je al hebt ...

  images: {
    remotePatterns: [
      {
        protocol: 'https', // Supabase storage gebruikt https
        hostname: 'nwtkgoeqrmisaknysuhu.supabase.co', // De exacte hostname uit de error
        port: '', // Leeg laten voor standaard poort (443 voor https)
        pathname: '/storage/v1/object/public/**', // Optioneel: Wees specifieker over het pad
      },
      // Voeg hier eventueel andere domeinen toe waarvan je afbeeldingen wilt laden
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
    // Als je de oudere `domains` array gebruikte (minder aanbevolen):
    // domains: ['nwtkgoeqrmisaknysuhu.supabase.co'],
  },

  // ... eventuele andere configuraties ...
};

module.exports = nextConfig; // Of export default nextConfig; als je ES modules gebruikt 