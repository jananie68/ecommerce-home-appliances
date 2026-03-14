import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { getAdminAnalytics } from "../../services/api";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAdminAnalytics()
      .then(({ data }) => setAnalytics(data))
      .catch((error) => console.error("Failed to load analytics", error));
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Sales analytics</h1>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Orders by status</h2>
            <div className="mt-6 space-y-3">
              {Object.entries(analytics?.salesByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="font-medium text-slate-700">{status}</span>
                  <span className="font-bold text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Top selling products</h2>
            <div className="mt-6 space-y-3">
              {(analytics?.topSellingProducts || []).map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="font-medium text-slate-700">{product.name}</span>
                  <span className="font-bold text-slate-900">{product.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAnalytics;
