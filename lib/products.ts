export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string; // Token price formatted e.g. "25.00"
  image: string;
  badge?: string;
  rating: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-earbuds-01',
    name: 'AetherPro Wireless Earbuds',
    tagline: 'Active Noise Cancellation with Spatial Audio',
    description: 'Ultra-low latency Bluetooth 5.4 wireless earbuds featuring custom 11mm dynamic drivers and lossless spatial audio.',
    price: '25.00',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    rating: 4.9,
  },
  {
    id: 'prod-watch-02',
    name: 'PulseX Minimalist Smartwatch',
    tagline: 'Titanium Case & Sapphire Crystal Display',
    description: 'Sleek health & fitness tracker with 14-day battery life, continuous heart rate sensor, and water resistance up to 50m.',
    price: '65.00',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    rating: 4.8,
  },
  {
    id: 'prod-keyboard-03',
    name: 'CyberKey RGB Mechanical Keyboard',
    tagline: 'Hot-swappable Custom Linear Switches',
    description: '75% layout custom wireless mechanical keyboard with per-key RGB backlighting and gasket mounted acoustic dampening.',
    price: '95.00',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    badge: 'Limited',
    rating: 5.0,
  },
  {
    id: 'prod-glasses-04',
    name: 'Luminary AR Smart Glasses',
    tagline: 'Heads-Up Holographic Micro-OLED Display',
    description: 'Next-generation lightweight augmented reality smart eyewear with real-time translation and navigation display.',
    price: '150.00',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    badge: 'New Era',
    rating: 4.9,
  },
];
