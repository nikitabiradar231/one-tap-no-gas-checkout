'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Zap, Wallet, ExternalLink } from 'lucide-react';
import { getBalances } from '../lib/tokens';
import { BLOCK_EXPLORER_URL, TOKEN_CONFIG } from '../lib/config';

interface SmartAccountBadgeProps {
  smartAccountAddress: `0x${string}` | null;
  eoaAddress?: string | null;
}

export const SmartAccountBadge: React.FC<SmartAccountBadgeProps> = ({
  smartAccountAddress,
}) => {
  const [copied, setCopied] = useState(false);
  const [balances, setBalances] = useState({
    ethBalance: '0.00',
    tokenBalance: '0.00',
  });

  useEffect(() => {
    if (smartAccountAddress) {
      getBalances(smartAccountAddress).then((b) => {
        setBalances({
          ethBalance: b.ethBalance,
          tokenBalance: b.tokenBalance,
        });
      });

      const interval = setInterval(() => {
        getBalances(smartAccountAddress).then((b) => {
          setBalances({
            ethBalance: b.ethBalance,
            tokenBalance: b.tokenBalance,
          });
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [smartAccountAddress]);

  const copyAddress = () => {
    if (smartAccountAddress) {
      navigator.clipboard.writeText(smartAccountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!smartAccountAddress) {
    return null;
  }

  const truncatedAddress = `${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`;

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-2xl p-4 shadow-xl text-slate-100 max-w-md w-full transition-all duration-300 hover:border-emerald-500/50">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Buyer Payment Account
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Smart Account
              </span>
            </div>
            <p className="text-sm font-mono font-medium text-slate-200">{truncatedAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={copyAddress}
            title="Copy Smart Account Address"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={`${BLOCK_EXPLORER_URL}/address/${smartAccountAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Explorer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
        <div className="bg-slate-850/60 rounded-xl p-2.5 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Gas Balance (Sponsored)
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-baseline gap-1 mt-0.5">
            <span>0.00 ETH</span>
            <span className="text-[10px] text-emerald-400/80 font-normal">(100% Free Gas)</span>
          </div>
        </div>

        <div className="bg-slate-850/60 rounded-xl p-2.5 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-blue-400" /> {TOKEN_CONFIG.symbol} Balance
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">
            {balances.tokenBalance} {TOKEN_CONFIG.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};
