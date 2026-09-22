'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/applications', label: 'Applications', icon: FileText },
];

export default function AdminSidebar({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = NAV;

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map(item => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={`group flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm transition-all ${
              active
                ? 'bg-[#0d1b30] text-[#f0c169] font-bold border-l-4 border-[#c2850c] shadow-sm'
                : 'text-white/80 font-medium hover:text-white hover:bg-white/[0.06] border-l-4 border-transparent'
            }`}
          >
            <Icon
              size={17}
              className={active ? 'text-[#f0c169]' : 'text-white/60 group-hover:text-white'}
            />
            <span className="flex-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-transparent">
        <img src="/WhiteHouse_Logo-removebg-preview.png" alt="White House Logo" className="h-full w-full object-contain filter brightness-0 invert opacity-90" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white leading-tight font-serif">Admin Portal</p>
        <p className="truncate text-[0.7rem] text-[#f0c169] uppercase tracking-wider leading-tight">Relief Program</p>
      </div>
    </div>
  );

  const account = (
    <div className="rounded-md border border-white/20 bg-[#0d1b30] p-3 text-white">
      <p className="truncate text-xs font-bold text-white">{name || 'Administrator'}</p>
      <p className="truncate text-[0.7rem] text-white/70">{email}</p>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-sm border border-[#d83933] bg-transparent px-3 py-1.5 text-[0.72rem] font-bold text-[#fde0de] transition-colors hover:bg-[#d83933] hover:text-white"
      >
        <LogOut size={13} />
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#c2850c] bg-[#162e51] px-4 py-3 shadow-md lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/[0.1]"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-[#c2850c] bg-[#162e51] p-4 shadow-xl text-white">
            <div className="mb-6 flex items-center justify-between">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
            {links}
            <div className="mt-4">{account}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r-4 border-[#c2850c] bg-[#162e51] p-4 text-white shadow-xl lg:flex">
        <div className="mb-7 px-1 pt-1.5">{brand}</div>
        <div className="flex-1">{links}</div>
        {account}
      </aside>
    </>
  );
}
