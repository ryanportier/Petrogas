'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Fuel, Activity, BarChart3, History, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { formatAddress } from '@/lib/utils';

export function Navbar() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Fuel },
    { href: '/swap', label: 'Swap', icon: Activity },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="border-b-4 border-brown-900 bg-cream-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 border-4 border-brown-900 bg-rust-500 flex items-center justify-center shadow-pixel-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">
              <Fuel className="w-6 h-6 text-cream-50" />
            </div>
            <div>
              <span className="font-bold text-xl text-brown-900 block leading-tight">
                PetroGas
              </span>
              <span className="text-xs text-brown-600 uppercase tracking-wide">
                Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 font-mono font-bold uppercase text-sm border-2 border-brown-900 bg-cream-50 hover:bg-cream-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            {ready && !authenticated ? (
              <button onClick={login} className="btn-pixel text-sm">
                Connect Wallet
              </button>
            ) : ready && authenticated ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 border-2 border-brown-900 bg-forest-500 text-cream-50 font-bold text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 border-2 border-brown-900 bg-cream-50 hover:bg-cream-200 font-mono font-bold text-sm transition-colors"
                >
                  {user?.wallet?.address ? formatAddress(user.wallet.address) : 'Disconnect'}
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 border-brown-900 bg-cream-50"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brown-900" />
            ) : (
              <Menu className="w-6 h-6 text-brown-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-brown-900 bg-cream-50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 font-mono font-bold uppercase text-sm border-2 border-brown-900 bg-cream-100 hover:bg-cream-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-4 border-t-2 border-brown-900">
              {ready && !authenticated ? (
                <button onClick={login} className="btn-pixel w-full text-sm">
                  Connect Wallet
                </button>
              ) : ready && authenticated ? (
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 border-2 border-brown-900 bg-cream-100 hover:bg-cream-200 font-mono font-bold text-sm transition-colors"
                >
                  {user?.wallet?.address ? formatAddress(user.wallet.address) : 'Disconnect'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
