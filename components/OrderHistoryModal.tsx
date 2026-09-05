'use client';

import React from 'react';
import { X, ExternalLink, CheckCircle2, AlertTriangle, Clock, RotateCcw } from 'lucide-react';
import { Order, orderRegistry } from '../lib/orders';
import { BLOCK_EXPLORER_URL, TOKEN_CONFIG } from '../lib/config';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrderToRetry?: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectOrderToRetry,
}) => {
  if (!isOpen) return null;

  const orders = orderRegistry.getAllOrders();

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid (Success)
          </span>
        );
      case 'pending':
      case 'submitting':
        return (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-spin" /> Processing...
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Order History</h2>
            <p className="text-xs text-slate-400">All smart-account purchase records</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No previous orders found.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400">{order.id}</div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Items: {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="font-extrabold text-slate-200">
                    Total: {order.totalAmount} {TOKEN_CONFIG.symbol}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.txHash && (
                      <a
                        href={`${BLOCK_EXPLORER_URL}/tx/${order.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        Basescan <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {(order.status === 'failed' || order.status === 'rejected') &&
                      onSelectOrderToRetry && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectOrderToRetry(order);
                          }}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl font-bold flex items-center gap-1 border border-emerald-500/30"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
