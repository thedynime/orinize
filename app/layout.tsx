import type { Metadata } from 'next';
import './globals.css';
import './landing.css';
export const metadata: Metadata = {
 title: 'Orinize — Intelligence for Everything You Do.',
 icons: { icon: '/brand/orinize-icon.svg', apple: '/brand/orinize-icon.png' },
 description: 'Meet Orinize, your AI partner for questions, ideas, and getting unstuck. Write clearly, build confidently, and learn deeply.',
 openGraph: { title: 'Orinize — Intelligence for Everything You Do.', description: 'Your thinking partner for writing, learning, building, and everyday ideas.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" suppressHydrationWarning><body>{children}</body></html>; }
