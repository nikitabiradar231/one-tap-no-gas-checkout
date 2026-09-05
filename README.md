# AETHER — One-Tap, No Gas, No Top-Up Smart Wallet Checkout

A production-grade, state-of-the-art e-commerce checkout application built with **Next.js 15**, **Privy Smart Wallets (Account Abstraction)**, and **Viem**. 

The application enables buyers to make single-click purchases using test ERC-20 tokens with **100% sponsored gas (0 native ETH required)**, atomic batch calls (`approve` + `transfer`), strict duplicate purchase prevention, and real-time transaction receipt verification.

---

## Technical Configuration & Specs

| Setting | Configuration Value |
| :--- | :--- |
| **Testnet Used** | **Base Sepolia** |
| **Chain ID** | `84532` |
| **RPC Endpoint** | `https://sepolia.base.org` |
| **ERC-20 Test Token** | Test USDC (`USDC`) |
| **Token Contract Address** | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| **Token Decimals** | `6` |
| **Merchant Receiver Address** | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| **Smart Account Implementation** | Privy Smart Wallets Client (`useSmartWallets`) |
| **Paymaster Sponsorship** | Pimlico / Privy Paymaster Service (`wallet_sendCalls`) |
| **Block Explorer** | [Basescan Sepolia](https://sepolia.basescan.org) |

---

## Architectural Rules Compliance

### 1. Smart Account Transaction Sender
- The purchase transaction is ALWAYS submitted through the **Privy Smart Account** (`smartWalletClient` derived via `useSmartWallets`).
- The embedded EOA wallet is used strictly as an authentication mechanism and signer key.
- The UI exclusively displays the **Smart Account Address** as the buyer's payment address.

### 2. One-Tap Atomic Batch Transaction (`wallet_sendCalls`)
- Single smart wallet call bundle containing:
  1. `ERC20.approve(merchantAddress, amountWei)`
  2. `ERC20.transfer(merchantAddress, amountWei)`
- Both calls execute atomically in one transaction. The user NEVER makes two sequential transactions or confirmations.

### 3. Zero Native Gas Token Required
- Gas fees are sponsored 100% via the configured Paymaster service (`capabilities: { paymasterService: { url } }`).
- The buyer can execute purchases with **0.00 ETH** native balance.

### 4. Floating-Point Precision Protection
- Token amounts are strictly calculated using Viem's decimals-aware helper:
  ```ts
  parseUnits(amountStr, TOKEN_CONFIG.decimals)
  ```
- Eliminates floating point errors (e.g. `price * 10 ** decimals`).

### 5. Duplicate Purchase Protection & Idempotency
- Every purchase is initialized with a deterministic **Order Identity** (e.g., `ORD-1725571200-A9B8`).
- The `orderRegistry` checks whether an order with the same `orderId` is already `submitting`, `pending`, or `success`.
- Duplicate submit requests for the same order identity are rejected, preventing double charging.

### 6. Real Transaction Receipt Verification
- The application NEVER sets order status to `success` immediately upon button click.
- After obtaining the transaction hash, the client polls `publicClient.waitForTransactionReceipt({ hash })`.
- Status is set to `success` ONLY when `receipt.status === 'success'`.

### 7. Explicit Error & Rejection Handling
- User rejections, gas errors, RPC timeouts, or contract reverts transition the UI to an explicit `rejected` or `failed` state.
- Actionable buttons ("Retry One-Tap Payment", "Cancel", "Return to Shop") allow immediate user recovery.

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Safe `.env.local` Example:
```env
# Privy Application ID
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Target Network (Base Sepolia)
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Paymaster Sponsorship Service URL
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/84532/rpc?apikey=your_pimlico_api_key

# Test ERC-20 Token (Base Sepolia Test USDC)
NEXT_PUBLIC_TOKEN_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
NEXT_PUBLIC_TOKEN_SYMBOL=USDC
NEXT_PUBLIC_TOKEN_DECIMALS=6

# Merchant Store Vault Address
NEXT_PUBLIC_MERCHANT_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

> **Security Note:** All secrets are kept out of version control via `.gitignore`.

---

## How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

---

## Codebase Map for Reviewers

- **[lib/smart-account.ts](file:///c:/Users/nikita/OneDrive/Desktop/dev2/lib/smart-account.ts)**: Core `wallet_sendCalls` atomic batching logic (`approve` + `transfer`), paymaster capability injection, and receipt polling.
- **[lib/tokens.ts](file:///c:/Users/nikita/OneDrive/Desktop/dev2/lib/tokens.ts)**: `parseUnits` decimal-aware conversion helpers and Viem public client.
- **[lib/orders.ts](file:///c:/Users/nikita/OneDrive/Desktop/dev2/lib/orders.ts)**: Order identity generator, status tracking, and duplicate purchase guard.
- **[components/SmartAccountBadge.tsx](file:///c:/Users/nikita/OneDrive/Desktop/dev2/components/SmartAccountBadge.tsx)**: Buyer payment address rendering (Smart Account only) and sponsored gas badge.
- **[components/CheckoutModal.tsx](file:///c:/Users/nikita/OneDrive/Desktop/dev2/components/CheckoutModal.tsx)**: Shop checkout drawer, real-time status steps, and explicit rejection/retry UI.
