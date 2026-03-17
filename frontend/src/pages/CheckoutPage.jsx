import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, totals } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(
    user?.addressBook?.[0] || {
      fullName: user?.name || "",
      phone: user?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: ""
    }
  );

  if (!cartItems.length) {
    return (
      <div className="section-shell py-16">
        <div className="rounded-[36px] bg-white p-12 text-center shadow-soft">
          <h1 className="font-display text-4xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Add products before proceeding to checkout.</p>
        </div>
      </div>
    );
  }

  async function verifyAndFinish(orderId, paymentPayload, demoMode = false) {
    const verification = await api.post("/orders/verify", {
      orderId,
      ...paymentPayload
    });

    clearCart();
    navigate("/order-confirmation", {
      replace: true,
      state: {
        order: verification.data.order,
        demoMode
      }
    });
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const creation = await api.post("/orders/create", {
        cartItems,
        address
      });

      const { orderId, razorpayOrder, keyId } = creation.data;

      if (keyId === "demo_key") {
        await verifyAndFinish(
          orderId,
          {
            razorpayOrderId: razorpayOrder.id,
            razorpayPaymentId: `pay_demo_${Date.now()}`,
            razorpaySignature: `demo_signature_${Date.now()}`
          },
          true
        );
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error("Razorpay checkout could not be loaded.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "Sri Palani Andavan Electronics",
        description: "Secure appliance checkout",
        handler: async (response) => {
          await verifyAndFinish(orderId, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: address.phone
        },
        theme: {
          color: "#f7643b"
        }
      });

      razorpay.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-shell py-12">
      <form onSubmit={handleCheckout} className="grid gap-8 xl:grid-cols-[1fr_24rem]">
        <div className="rounded-[36px] bg-white p-8 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Checkout</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink">Confirm your delivery details</h1>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone number"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
              ["landmark", "Landmark"]
            ].map(([key, label]) => (
              <div key={key} className={key === "line1" || key === "line2" ? "sm:col-span-2" : ""}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
                <input
                  required={["fullName", "phone", "line1", "city", "state", "pincode"].includes(key)}
                  value={address[key]}
                  onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[32px] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Order summary</p>
          <div className="mt-5 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="font-bold text-ink">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm">
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
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="font-semibold text-slate-600">Total</span>
              <span className="text-2xl font-black text-ink">{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-coral px-5 py-4 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Preparing checkout..." : "Pay with Razorpay"}
          </button>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            If Razorpay keys are not configured, checkout will safely use demo verification mode for local testing.
          </p>
        </aside>
      </form>
    </div>
  );
}

export default CheckoutPage;
