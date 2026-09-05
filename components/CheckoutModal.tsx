'use client';

import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { Order, orderRegistry } from '../lib/orders';
import { executeOneTapPurchase } from '../lib/smart-account';
import { BLOCK_EXPLORER_URL, TOKEN_CONFIG } from '../lib/config';

interface CheckoutModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  smartAccountAddress: `0x${string}` | null;
  smartWalletClient: any;
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  order,
  isOpen,
  onClose,
  smartAccountAddress,
  smartWalletClient,
  onSuccess,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronize internal state when prop changes
  React.useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  if (!isOpen || !currentOrder) return null;

  const handlePurchase = async () => {
    if (!smartAccountAddress || !smartWalletClient) {
      alert('Please connect your Privy Smart Account wallet first.');
      return;
    }

    // Check duplicate protection (Rule 7 & Rule 15)
    const canSubmit = orderRegistry.canSubmitOrder(currentOrder.id);
    if (!canSubmit.allowed) {
      alert(canSubmit.reason);
      return;
    }

    setIsProcessing(true);

    const result = await executeOneTapPurchase({
      orderId: currentOrder.id,
      totalAmountStr: currentOrder.totalAmount,
      smartAccountAddress,
      smartWalletClient,
    });

    setIsProcessing(false);
    setCurrentOrder(result.order);

    if (result.success) {
      onSuccess(result.order);
    }
  };

  const truncatedAccount = smartAccountAddress
    ? `${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`
    : 'Not Connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Gasless Checkout
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Order Identity: <span className="text-emerald-400 font-bold">{currentOrder.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Buyer Smart Account Card (Rule 4) */}
          <div className="bg-slate-950/50 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Payment Account (Smart Account)
                </div>
                <div className="text-sm font-mono text-slate-200 font-medium">
                  {truncatedAccount}
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> Gas Sponsored
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Order Items
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {currentOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-slate-850/60 p-3 rounded-2xl border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{item.name}</h4>
                      <div className="text-xs text-slate-400">
                        Qty: {item.quantity} × {item.price} {TOKEN_CONFIG.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-slate-100">
                    {(Number(item.price) * item.quantity).toFixed(2)} {TOKEN_CONFIG.symbol}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal ({currentOrder.items.length} items)</span>
              <span className="font-semibold text-slate-200">
                {currentOrder.totalAmount} {TOKEN_CONFIG.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" /> Network Gas Fee (Paymaster)
              </span>
              <span className="font-bold text-emerald-400">$0.00 (Sponsored)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-100">Total Payable</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {currentOrder.totalAmount} {TOKEN_CONFIG.symbol}
              </span>
            </div>
          </div>

          {/* Status Banner / Tracker */}
          {currentOrder.status === 'submitting' && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-3 text-blue-300 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <div>
                <div className="font-bold text-sm">Submitting Atomic Batch Transaction...</div>
                <div className="text-xs text-blue-400/80">
                  Batched Approve & Transfer calls sent to Smart Account
                </div>
              </div>
            </div>
          )}

          {currentOrder.status === 'pending' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-3 text-amber-300">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <div>
                  <div className="font-bold text-sm">Awaiting Blockchain Confirmation...</div>
                  <div className="text-xs text-amber-400/80">
                    Polling transaction receipt from testnet RPC.
                  </div>
                </div>
              </div>
              {currentOrder.txHash && (
                <div className="text-xs font-mono pt-1 text-amber-200/90 break-all">
                  Tx Hash: {currentOrder.txHash}
                </div>
              )}
            </div>
          )}

          {currentOrder.status === 'success' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl space-y-2 text-emerald-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-extrabold text-base text-emerald-400">
                    Payment Successful!
                  </div>
                  <div className="text-xs text-emerald-300/80">
                    Order confirmed via smart account receipt.
                  </div>
                </div>
              </div>
              {currentOrder.txHash && (
                <a
                  href={`${BLOCK_EXPLORER_URL}/tx/${currentOrder.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline pt-1"
                >
                  View Transaction on Basescan Explorer <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {(currentOrder.status === 'failed' || currentOrder.status === 'rejected') && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2 text-rose-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
                <div>
                  <div className="font-bold text-base text-rose-400">
                    {currentOrder.status === 'rejected' ? 'Payment Rejected' : 'Payment Failed'}
                  </div>
                  <div className="text-xs text-rose-300/90">
                    {currentOrder.error || 'The purchase transaction could not be completed.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800">
          {currentOrder.status === 'idle' && (
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !smartAccountAddress}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-slate-950" /> One-Tap Pay {currentOrder.totalAmount}{' '}
              {TOKEN_CONFIG.symbol} (0 Gas)
            </button>
          )}

          {(currentOrder.status === 'submitting' || currentOrder.status === 'pending') && (
            <button
              disabled
              className="w-full bg-slate-800 text-slate-400 font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 cursor-wait"
            >
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Processing Smart
              Wallet Order...
            </button>
          )}

          {currentOrder.status === 'success' && (
            <button
              onClick={onClose}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Done / Return to Shop <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {(currentOrder.status === 'failed' || currentOrder.status === 'rejected') && (
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm py-4 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry One-Tap Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
