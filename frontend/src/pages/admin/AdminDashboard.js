import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { getAdminAnalytics } from "../../services/api";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAdminAnalytics()
      .then(({ data }) => setAnalytics(data))
      .catch((error) => console.error("Failed to load analytics", error));
  }, []);

  const overview = analytics?.overview || {};

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-slate-500">Track sales, low inventory, and store performance in one place.</p>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Revenue", `Rs. ${overview.totalRevenue || 0}`],
            ["Orders", overview.totalOrders || 0],
            ["Products", overview.totalProducts || 0],
            ["Users", overview.totalUsers || 0],
            ["Categories", overview.totalCategories || 0]
          ].map(([label, value]) => (
            <div key={label} className="themed-card p-6">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent orders</h2>
            <div className="mt-6 space-y-4">
              {(analytics?.recentOrders || []).map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">#{order._id.slice(-8)}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{order.orderItems.length} items</p>
                  <p className="mt-2 font-bold text-slate-900">Rs. {order.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Low stock alerts</h2>
            <div className="mt-6 space-y-4">
              {(analytics?.lowStockProducts || []).map((product) => (
                <div key={product._id} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-sm text-red-600">Only {product.stock} left in inventory</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
