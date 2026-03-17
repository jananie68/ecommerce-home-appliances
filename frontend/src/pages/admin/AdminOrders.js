import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { getAdminOrders, updateOrderStatus } from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const { data } = await getAdminOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Manage orders</h1>
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="themed-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Order #{order._id.slice(-8)}</h2>
                  <p className="mt-2 text-sm text-slate-500">Customer: {order.user?.name || "Unknown"}</p>
                  <p className="mt-1 text-sm text-slate-500">Total: Rs. {order.totalPrice}</p>
                </div>
                <select
                  value={order.status}
                  onChange={async (event) => {
                    await updateOrderStatus(order._id, event.target.value);
                    loadOrders();
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                >
                  {["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminOrders;
