import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediCity — Autonomous Isometric Hospital Simulation',
  description: 'An autonomous isometric hospital simulation that feels like a strategy game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-screen h-screen overflow-hidden bg-sky-100 text-slate-800 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
