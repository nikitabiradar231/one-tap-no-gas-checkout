'use client';

import React from 'react';
import { ShoppingBag, History, LogIn, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { SmartAccountBadge } from './SmartAccountBadge';

interface HeaderProps {
  authenticated: boolean;
  userAddress: string | null;
  smartAccountAddress: `0x${string}` | null;
  cartCount: number;
  onLogin: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  authenticated,
  smartAccountAddress,
  cartCount,
  onLogin,
  onLogout,
  onOpenCart,
  onOpenHistory,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">AETHER</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ONE-TAP
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Zero Gas • Smart Account Checkout
            </p>
          </div>
        </div>

        {/* Center: Smart Account Banner (Desktop) */}
        {authenticated && smartAccountAddress && (
          <div className="hidden lg:block">
            <SmartAccountBadge smartAccountAddress={smartAccountAddress} />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 text-sm font-semibold"
            title="Order History"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Orders</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {authenticated ? (
            <button
              onClick={onLogout}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-medium flex items-center gap-2"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" /> Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Mobile Smart Account Banner */}
      {authenticated && smartAccountAddress && (
        <div className="lg:hidden p-3 border-t border-slate-800/60 bg-slate-950">
          <SmartAccountBadge smartAccountAddress={smartAccountAddress} />
        </div>
      )}
    </header>
  );
};
