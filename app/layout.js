import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../components/AppProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'TEFReady — French for Canadian Life',
  description: 'Master French and achieve CLB 7+ in 3–4 months. AI-powered lessons designed for Punjabi and English speakers preparing for TEF Canada.',
  keywords: 'TEF Canada, CLB 7, French lessons, learn French, Punjabi immigrants Canada, IELTS French',
  openGraph: {
    title: 'TEFReady — French for Canadian Life',
    description: 'From zero to TEF CLB 7+ in 3–4 months. Designed for immigrants.',
    url: 'https://tefready.ca',
    siteName: 'TEFReady',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jakarta.variable} font-body antialiased`} style={{ background: 'var(--bg-page)', color: 'var(--text-body)' }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
