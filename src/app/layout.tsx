import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mwaslaty - Easy Transportation in Egypt',
  description: 'Your comprehensive guide to transportation across Egypt',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
