import { baseSepolia, sepolia } from 'viem/chains';

export const CHAIN = baseSepolia;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 84532);

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org';

export const PRIVY_APP_ID =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm1234567890privyappid';

export const PAYMASTER_URL =
  process.env.NEXT_PUBLIC_PAYMASTER_URL ||
  'https://api.pimlico.io/v2/84532/rpc?apikey=pim_demo_key';

// ERC-20 Token Configuration
export const TOKEN_CONFIG = {
  address: (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ||
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e') as `0x${string}`,
  symbol: process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC',
  decimals: Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 6),
};

// Merchant / Store Receiver Address
export const MERCHANT_ADDRESS = (process.env.NEXT_PUBLIC_MERCHANT_ADDRESS ||
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;

export const BLOCK_EXPLORER_URL = 'https://sepolia.basescan.org';
