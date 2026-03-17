import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAssetUrl } from "../lib/api";
import { formatCurrency } from "../lib/format";

function CartPage() {
  const { cartItems, removeFromCart, totals, updateQuantity } = useCart();

  if (!cartItems.length) {
    return (
      <div className="section-shell py-16">
        <div className="rounded-[36px] bg-white p-12 text-center shadow-soft">
          <ShoppingBag className="mx-auto text-coral" size={36} />
          <h1 className="mt-5 font-display text-4xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Browse refrigerators, washing machines, kitchen appliances, and more to start building your order.
          </p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-ink px-6 py-4 text-sm font-bold text-white">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-12">
      <div className="grid gap-8 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col gap-5 rounded-[32px] bg-white p-5 shadow-soft md:flex-row">
              <img
                src={getAssetUrl(item.image)}
                alt={item.name}
                className="h-48 w-full rounded-[24px] object-cover md:w-48"
              />
              <div className="flex flex-1 flex-col justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{item.brand}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">Unit price: {formatCurrency(item.discountPrice || item.price)}</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 px-3 py-2">
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-ink">
                      {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[32px] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">Cart totals</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold text-emerald-700">- {formatCurrency(totals.discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-ink">{formatCurrency(totals.shipping)}</span>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Total</span>
              <span className="text-2xl font-black text-ink">{formatCurrency(totals.total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-coral px-5 py-4 text-center text-sm font-bold text-white">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
