export type OrderStatus =
  | 'idle'
  | 'creating'
  | 'submitting'
  | 'pending'
  | 'success'
  | 'rejected'
  | 'failed';

export interface OrderItem {
  id: string;
  name: string;
  price: string; // Token price as string (e.g. "25.00")
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // Unique deterministic Order Identity (e.g. ORD-1725571200-A9B8)
  items: OrderItem[];
  totalAmount: string;
  tokenSymbol: string;
  decimals: number;
  buyerSmartAccount: string;
  status: OrderStatus;
  txHash?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

// In-Memory & LocalStorage persistent Order Registry for Duplicate Purchase Prevention
class OrderRegistry {
  private orders: Map<string, Order> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('gasless_shop_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        parsed.forEach((order) => this.orders.set(order.id, order));
      }
    } catch (err) {
      console.error('Failed to load orders from storage', err);
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const array = Array.from(this.orders.values());
        localStorage.setItem('gasless_shop_orders', JSON.stringify(array));
      } catch (err) {
        console.error('Failed to save orders to storage', err);
      }
    }
  }

  /**
   * Generates a unique, reproducible Order ID
   */
  public generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${randomSuffix}`;
  }

  /**
   * Registers a new order or retrieves existing order
   */
  public createOrder(
    items: OrderItem[],
    totalAmount: string,
    buyerSmartAccount: string,
    customOrderId?: string
  ): Order {
    const id = customOrderId || this.generateOrderId();

    // Check if order already exists (Idempotency check)
    if (this.orders.has(id)) {
      return this.orders.get(id)!;
    }

    const order: Order = {
      id,
      items,
      totalAmount,
      tokenSymbol: process.env.NEXT_PUBLIC_TOKEN_SYMBOL || 'USDC',
      decimals: Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 6),
      buyerSmartAccount,
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.orders.set(id, order);
    this.saveToStorage();
    return order;
  }

  /**
   * Checks if an order can be submitted for purchase
   * Prevents duplicate execution if order is currently submitting, pending, or already paid.
   */
  public canSubmitOrder(orderId: string): { allowed: boolean; reason?: string } {
    const order = this.orders.get(orderId);

    if (!order) {
      return { allowed: true };
    }

    if (order.status === 'submitting' || order.status === 'pending') {
      return {
        allowed: false,
        reason: `Order ${orderId} is currently being processed. Please wait for transaction receipt.`,
      };
    }

    if (order.status === 'success') {
      return {
        allowed: false,
        reason: `Order ${orderId} has already been completed successfully. Duplicate purchases are disabled.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Updates order status with timestamp and optional metadata (txHash / error)
   */
  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    extra?: { txHash?: string; error?: string }
  ): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found in registry.`);
    }

    order.status = status;
    order.updatedAt = Date.now();
    if (extra?.txHash) order.txHash = extra.txHash;
    if (extra?.error) order.error = extra.error;

    this.orders.set(orderId, order);
    this.saveToStorage();
    return { ...order };
  }

  public getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const orderRegistry = new OrderRegistry();
