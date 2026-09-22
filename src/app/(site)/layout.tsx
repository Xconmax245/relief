import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Layout for the public marketing site. The admin area lives outside this group
 * (`src/app/admin`) so it renders without the public Header/Footer chrome.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Skip nav (accessibility) */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Header />

      {children}

      <Footer />
    </>
  );
}
