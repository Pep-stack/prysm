import { colors, typography, commonStyles, fadeInUp } from '../lib/landingStyles'; // Assuming this is needed elsewhere or remove

// Metadata voor de site
export const metadata = {
  title: 'Prysma - Your Professional Profile', // Of je eigen titel
  description: 'Prysma turns your work, skills, and projects into one professional profile.', // Of je eigen beschrijving
  icons: {
    icon: '/favicon.ico', // Moet exact zo zijn voor public/favicon.ico
    // apple: '/apple-touch-icon.png', // Optioneel
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* De head tag wordt automatisch beheerd door Next.js op basis van metadata */}
      <body>{children}</body>
    </html>
  );
} 