"use client";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Economy & Jobs", href: "/economy-and-jobs" },
  { label: "National Security", href: "/national-security" },
  { label: "Energy Dominance", href: "/energy-dominance" },
  { label: "Border Security", href: "/border-security" },
  { label: "American Families", href: "/american-families" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">

        {/* ── Logo ── */}
        <a href="#" className="header-logo" aria-label="The White House — Home">
          <Image
            src="/WhiteHouse_Logo-removebg-preview.png"
            alt="The White House"
            width={52}
            height={52}
            style={{ objectFit: "contain" }}
            priority
          />
          <div className="header-logo-text">
            <strong>The White House</strong>
          </div>
        </a>

        {/* ── Desktop nav ── */}
        <nav aria-label="Primary navigation" className="header-nav-wrapper">
          <ul className="header-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Right controls ── */}
        <div className="header-controls">
          {/* Desktop search */}
          <div className="header-search" role="search">
            <label htmlFor="site-search" className="sr-only">Search</label>
            <input
              id="site-search"
              type="search"
              placeholder="Search..."
              aria-label="Site search"
            />
            <button type="button" aria-label="Submit search">
              <Search size={15} />
            </button>
          </div>

          {/* Mobile: search icon */}
          <button
            className="mobile-search-btn"
            aria-label="Toggle search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Mobile: hamburger */}
          <button
            className="mobile-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="mobile-search-bar">
          <label htmlFor="mobile-search" className="sr-only">Search</label>
          <input
            id="mobile-search"
            type="search"
            placeholder="Search whitehouse.gov..."
            aria-label="Mobile site search"
            autoFocus
          />
          <button type="button" aria-label="Submit search">
            <Search size={16} />
          </button>
        </div>
      )}

      {/* Mobile nav */}
      <nav
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
      >
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
