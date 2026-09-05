import { encodeFunctionData, parseAbi, parseUnits, formatUnits, createPublicClient, http } from 'viem';
import { CHAIN, RPC_URL, TOKEN_CONFIG } from './config';

// Standard ERC-20 ABI required for approving and transferring tokens
export const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address recipient, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

// Viem Public Client for reading balance and awaiting transaction receipts
export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});

/**
 * Converts a human-readable token amount string into exact base-unit BigInt
 * Strictly complies with Rule 5: Uses parseUnits to eliminate floating-point precision loss.
 */
export function toBaseUnits(amountStr: string, decimals: number = TOKEN_CONFIG.decimals): bigint {
  const sanitized = amountStr.trim();
  return parseUnits(sanitized, decimals);
}

/**
 * Formats a BigInt base-unit token amount into human-readable string
 */
export function fromBaseUnits(amountWei: bigint, decimals: number = TOKEN_CONFIG.decimals): string {
  return formatUnits(amountWei, decimals);
}

/**
 * Encodes the ERC-20 approve function data
 */
export function encodeApproveData(spender: `0x${string}`, amountWei: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spender, amountWei],
  });
}

/**
 * Encodes the ERC-20 transfer function data
 */
export function encodeTransferData(recipient: `0x${string}`, amountWei: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [recipient, amountWei],
  });
}

/**
 * Fetches buyer token balance and native ETH balance for UI display
 */
export async function getBalances(address: `0x${string}`) {
  try {
    const ethBalanceWei = await publicClient.getBalance({ address });
    const tokenBalanceWei = await publicClient.readContract({
      address: TOKEN_CONFIG.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return {
      ethBalance: formatUnits(ethBalanceWei, 18),
      tokenBalance: formatUnits(tokenBalanceWei, TOKEN_CONFIG.decimals),
      rawEth: ethBalanceWei,
      rawToken: tokenBalanceWei,
    };
  } catch (error) {
    console.error('Error fetching balances:', error);
    return {
      ethBalance: '0.00',
      tokenBalance: '0.00',
      rawEth: BigInt(0),
      rawToken: BigInt(0),
    };
  }
}
