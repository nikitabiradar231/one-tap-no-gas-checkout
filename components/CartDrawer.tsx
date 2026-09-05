'use client';

import React from 'react';
import { X, Trash2, ShoppingBag, Zap, ArrowRight } from 'lucide-react';
import { OrderItem } from '../lib/orders';
import { TOKEN_CONFIG } from '../lib/config';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Your Cart</h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              {items.length} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-400">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-200 truncate">{item.name}</h4>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {item.price} {TOKEN_CONFIG.symbol}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-200 px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-slate-950/80 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-slate-400">Total Payment</span>
              <div className="text-xl font-extrabold text-emerald-400">
                {totalAmount} <span className="text-sm font-semibold">{TOKEN_CONFIG.symbol}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-emerald-300 text-xs font-medium">
              <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400 shrink-0" />
              <span>100% Gas Sponsored — 0 ETH required from your wallet</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Gasless Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
