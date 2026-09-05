'use client';

import React from 'react';
import { Star, ShoppingBag, Zap, Check } from 'lucide-react';
import { Product } from '../lib/products';
import { TOKEN_CONFIG } from '../lib/config';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onAddToCart,
  isInCart = false,
}) => {
  return (
    <div className="group relative bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 bg-emerald-500/90 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
          {product.badge}
        </div>
      )}

      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {product.rating}
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Zap className="w-3 h-3 fill-emerald-400" /> 0 Gas Fee
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs font-medium text-emerald-400/90 mt-1">{product.tagline}</p>
          <p className="text-sm text-slate-400 mt-2 line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Price
            </div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
              <span>{product.price}</span>
              <span className="text-sm font-semibold text-emerald-400">{TOKEN_CONFIG.symbol}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className={`p-3 rounded-2xl border transition-all ${
                isInCart
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={isInCart ? 'In Cart' : 'Add to Cart'}
            >
              {isInCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onBuyNow(product)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" /> One-Tap Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
