import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "../src/components/auth/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Prysma - Your Professional Profile',
  description: 'Prysma turns your work, skills, and projects into one professional profile.',
  icons: {
    icon: '/favicon.ico', // Dit moet exact zo zijn
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <div id="modal-root"></div>
        </SessionProvider>
      </body>
    </html>
  );
}
