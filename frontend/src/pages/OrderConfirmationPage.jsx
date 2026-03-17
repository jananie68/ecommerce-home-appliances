import { CheckCircle2, PackageCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency } from "../lib/format";

function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;
  const demoMode = location.state?.demoMode;

  if (!order) {
    return (
      <div className="section-shell py-16">
        <div className="rounded-[36px] bg-white p-12 text-center shadow-soft">
          <h1 className="font-display text-4xl font-bold text-ink">Order details unavailable</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Please open your dashboard to see your recent order history and tracking updates.
          </p>
          <Link to="/dashboard/orders" className="mt-6 inline-flex rounded-full bg-ink px-6 py-4 text-sm font-bold text-white">
            Open dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-14">
      <div className="rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              <CheckCircle2 size={16} />
              Order confirmed
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold text-ink">Thank you for shopping with us.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your order is now confirmed and visible in your dashboard. We’ll keep you updated on processing and delivery.
            </p>
            {demoMode ? (
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                Demo payment mode was used because Razorpay keys are not configured yet.
              </p>
            ) : null}
          </div>
          <PackageCheck className="text-coral" size={42} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product} className="rounded-[28px] bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-xl font-bold text-ink">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-black text-ink">{formatCurrency(item.discountedPrice * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[28px] bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Order snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-semibold capitalize text-ink">{order.status.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-semibold text-ink">{formatCurrency(order.totals.total)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-ink">Delivery address</p>
                <p className="mt-2 leading-6">
                  {order.address.fullName}
                  <br />
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ""}
                  <br />
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>
            </div>

            <Link to="/dashboard/orders" className="mt-6 block rounded-full bg-ink px-5 py-4 text-center text-sm font-bold text-white">
              Track your order
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
