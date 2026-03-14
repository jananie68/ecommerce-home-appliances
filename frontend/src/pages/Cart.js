import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useStore } from "../context/StoreContext";
import { createOrder } from "../services/api";
import { getImageUrl } from "../utils/image";

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, user, clearCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const placeOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!cart.length) {
      return;
    }

    await createOrder({
      orderItems: cart.map((item) => ({
        product: item._id,
        name: item.name,
        qty: item.qty || 1,
        price: item.price,
        image: item.images?.[0] || item.image
      })),
      shippingAddress: {
        address: user.address?.street || "Update your profile address",
        city: user.address?.city || "City",
        postalCode: user.address?.postalCode || "000000",
        country: user.address?.country || "Country"
      },
      paymentMethod: "Cash on Delivery",
      itemsPrice: total,
      taxPrice: Number((total * 0.05).toFixed(2)),
      shippingPrice: total > 1000 ? 0 : 99,
      totalPrice: Number((total * 1.05 + (total > 1000 ? 0 : 99)).toFixed(2))
    });

    clearCart();
    navigate("/orders");
  };

  return (
    <div className="min-h-screen">
      <UserNavbar categories={[]} search="" onSearchChange={() => {}} />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <section className="themed-card p-6">
          <h1 className="text-3xl font-bold text-slate-900">Shopping cart</h1>
          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="grid gap-4 rounded-3xl border border-slate-200 p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                <div className="rounded-2xl bg-brand-gradient-soft p-4">
                  <img src={getImageUrl(item.images?.[0] || item.image)} alt={item.name} className="h-20 w-full object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{item.category}</p>
                  <p className="mt-2 font-bold text-slate-900">Rs. {item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.qty || 1}
                    onChange={(event) => updateCartQty(item._id, Number(event.target.value))}
                    className="w-20 rounded-2xl border border-slate-200 px-3 py-2"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <p className="text-slate-500">Your cart is empty.</p>}
          </div>
        </section>

        <aside className="rounded-[28px] bg-brand-gradient p-6 text-white shadow-panel">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <div className="flex justify-between">
              <span>Items</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{total > 1000 ? "Free" : "Rs. 99"}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rs. {(total * 0.05).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-700 pt-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>Rs. {(total * 1.05 + (total > 1000 ? 0 : 99)).toFixed(2)}</span>
            </div>
            <button onClick={placeOrder} className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-brand-primary shadow-soft transition hover:-translate-y-0.5">
              Place order
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Cart;
