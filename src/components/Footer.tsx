import Image from "next/image";
import { Share2, PlayCircle, MessageCircle, Camera } from "lucide-react";

const FOOTER_LINKS = {
  "Grant Program": [
    { label: "Eligibility Requirements", href: "/eligibility-requirements" },
    { label: "Application Process", href: "/application-process" },
    { label: "Check Application Status", href: "/check-application-status" },
    { label: "FAQs", href: "/faqs" },
  ],
  "Administration": [
    { label: "Economy & Jobs", href: "/economy-and-jobs" },
    { label: "National Security", href: "/national-security" },
    { label: "Energy Dominance", href: "/energy-dominance" },
    { label: "Border Security", href: "/border-security" },
  ],
  "Contact": [
    { label: "Contact Us", href: "/contact-us" },
    { label: "Media Inquiries", href: "/media-inquiries" },
    { label: "Find Your Representative", href: "/find-your-representative" },
    { label: "USA.gov", href: "https://www.usa.gov" },
  ],
};

const LEGAL_LINKS = [
  { label: "Accessibility", href: "/accessibility" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "FOIA", href: "/foia" },
  { label: "No Fear Act", href: "/no-fear-act" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Vulnerability Disclosure Policy", href: "/vulnerability-disclosure-policy" },
  { label: "Office of Civil Rights", href: "/office-of-civil-rights" },
];

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      {/* Return to top */}
      <div className="return-to-top">
        <a href="#top">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" />
          </svg>
          Return to top
        </a>
      </div>

      {/* Main footer */}
      <div className="footer-top">
        <div className="footer-top-inner">
          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <Image
                src="/WhiteHouse_Logo-removebg-preview.png"
                alt="The White House"
                width={54}
                height={54}
                style={{ objectFit: "contain" }}
              />
              <strong>The White House</strong>
            </div>
            <p>
              The official website of the Trump Administration.
              Committed to putting America and its citizens first.
            </p>
            {/* Social icons */}
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Share2 size={16} /></a>
              <a href="#" aria-label="YouTube"><PlayCircle size={16} /></a>
              <a href="#" aria-label="X (Twitter)"><MessageCircle size={16} /></a>
              <a href="#" aria-label="Instagram"><Camera size={16} /></a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div className="footer-col" key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <ul className="footer-legal-links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <p className="footer-gov-note">
            Looking for U.S. government information and services?{" "}
            <a href="https://www.usa.gov" target="_blank" rel="noopener noreferrer">
              Visit USA.gov
            </a>
          </p>
        </div>
      </div>

      {/* Identifier bar */}
      <div className="identifier-bar">
        <div className="identifier-bar-inner">
          An official website of the United States Government | Executive Office of the President
        </div>
      </div>
    </footer>
  );
}
