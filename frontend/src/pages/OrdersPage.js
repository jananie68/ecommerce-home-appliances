import React, { useEffect, useState } from "react";
import OrderTimeline from "../components/OrderTimeline";
import UserNavbar from "../components/UserNavbar";
import { getMyOrders } from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch((error) => console.error("Failed to load orders", error));
  }, []);

  return (
    <div className="min-h-screen">
      <UserNavbar categories={[]} search="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Track your orders</h1>
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <article key={order._id} className="themed-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Order #{order._id.slice(-8)}</h2>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {order.status}
                </span>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="font-semibold text-slate-900">Items</p>
                  <div className="mt-4 space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={`${item.product}-${index}`} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                        <span>{item.name}</span>
                        <span>
                          {item.qty} x Rs. {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <OrderTimeline steps={order.trackingSteps || []} />
              </div>
            </article>
          ))}
          {orders.length === 0 && <p className="text-slate-500">You have not placed any orders yet.</p>}
        </div>
      </main>
    </div>
  );
}

export default OrdersPage;
