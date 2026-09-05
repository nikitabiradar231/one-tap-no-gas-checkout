'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderHistoryModal } from '../components/OrderHistoryModal';
import { PRODUCTS, Product } from '../lib/products';
import { OrderItem, Order, orderRegistry } from '../lib/orders';
import { TOKEN_CONFIG, MERCHANT_ADDRESS } from '../lib/config';
import { Zap, ShieldCheck, CheckCircle2, Lock, ArrowRight, ExternalLink, Layers } from 'lucide-react';

export default function Storefront() {
  const { login, logout, authenticated, user } = usePrivy();
  const { client: smartWalletClient } = useSmartWallets();

  // Smart Account Address derived from Privy Smart Wallet (Rule 1 & Rule 4)
  const [smartAccountAddress, setSmartAccountAddress] = useState<`0x${string}` | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal states
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync Smart Account Address from Privy Smart Wallets Client
  useEffect(() => {
    if (smartWalletClient?.account?.address) {
      setSmartAccountAddress(smartWalletClient.account.address as `0x${string}`);
    } else if (user?.wallet?.address) {
      // Fallback for demonstration if smart account client initializes lazily
      setSmartAccountAddress(user.wallet.address as `0x${string}`);
    } else {
      setSmartAccountAddress(null);
    }
  }, [smartWalletClient, user]);

  // Cart functions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Immediate "Buy Now" flow
  const handleBuyNow = (product: Product) => {
    if (!authenticated) {
      login();
      return;
    }

    const item: OrderItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };

    const buyerAddr = smartAccountAddress || '0x0000000000000000000000000000000000000000';
    const order = orderRegistry.createOrder([item], product.price, buyerAddr);
    setActiveOrder(order);
    setIsCheckoutOpen(true);
  };

  // Cart Checkout flow
  const handleCartCheckout = () => {
    if (!authenticated) {
      login();
      return;
    }

    if (cartItems.length === 0) return;

    const totalAmount = cartItems
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      .toFixed(2);

    const buyerAddr = smartAccountAddress || '0x0000000000000000000000000000000000000000';
    const order = orderRegistry.createOrder(cartItems, totalAmount, buyerAddr);
    setActiveOrder(order);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    // Clear cart if items matched
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        authenticated={authenticated}
        userAddress={user?.wallet?.address || null}
        smartAccountAddress={smartAccountAddress}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onLogin={login}
        onLogout={logout}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4 fill-emerald-400" /> Problem 2: One Tap, No Gas, No Top-Up
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              One-Tap Gasless <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Smart Account Checkout
              </span>
            </h1>

            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Experience frictionless web3 payments. Zero ETH required for gas, zero double approvals, and 100% atomic transaction execution via Privy Smart Wallets.
            </p>

            {/* Architecture Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 font-bold">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-100">Zero Gas Top-Up</h4>
                <p className="text-xs text-slate-400 mt-1">
                  100% Paymaster sponsored. Works with 0 native ETH balance.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 font-bold">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-100">Batched Approve + Transfer</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Single atomic transaction send. Never requires two approvals.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 font-bold">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-100">Order Idempotency</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Deterministic Order Identity prevents double charging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Featured Hardware Catalog</h2>
            <p className="text-sm text-slate-400 mt-1">
              Select items to purchase with test {TOKEN_CONFIG.symbol} on Base Sepolia
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Merchant: {MERCHANT_ADDRESS.slice(0, 6)}...{MERCHANT_ADDRESS.slice(-4)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              isInCart={cartItems.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 AETHER Gasless Shop • Problem 2 Solution • Built with Privy Smart Wallets
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>Chain ID: 84532 (Base Sepolia)</span>
            <span>Token: {TOKEN_CONFIG.symbol}</span>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCartCheckout}
      />

      <CheckoutModal
        order={activeOrder}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        smartAccountAddress={smartAccountAddress}
        smartWalletClient={smartWalletClient}
        onSuccess={handleOrderSuccess}
      />

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectOrderToRetry={(order) => {
          setActiveOrder(order);
          setIsCheckoutOpen(true);
        }}
      />
    </div>
  );
}
