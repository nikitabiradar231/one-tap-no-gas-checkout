'use client';

import React, { useEffect, useState } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { baseSepolia } from 'viem/chains';
import { PRIVY_APP_ID } from '../lib/config';

// Validly formatted Privy App ID placeholder for build prerendering
const VALID_APP_ID =
  PRIVY_APP_ID && PRIVY_APP_ID.length >= 10 && !PRIVY_APP_ID.includes('demo')
    ? PRIVY_APP_ID
    : 'clx0000000000000000000000000';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-slate-950 text-slate-100 min-h-screen">{children}</div>;
  }

  return (
    <PrivyProvider
      appId={VALID_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#10b981', // emerald-500
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}
