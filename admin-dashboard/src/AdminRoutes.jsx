import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  PackageSearch,
  Plus,
  Save,
  Trash2,
  Users
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ShipmentTrackerCard from "@/components/ShipmentTrackerCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime, formatStatusLabel } from "@/lib/format";

const tabs = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "products", label: "Products", icon: Boxes },
  { key: "orders", label: "Orders", icon: PackageSearch },
  { key: "customers", label: "Customers", icon: Users }
];

const emptyProduct = {
  name: "",
  brand: "",
  category: "",
  description: "",
  shortDescription: "",
  price: "",
  discountPrice: "",
  warranty: "",
  stockQuantity: "",
  popularityScore: "0",
  imageUrls: "",
  specifications: "",
  tags: "",
  isFeatured: false
};

const orderStatusOptions = [
  "pending-payment",
  "confirmed",
  "processing",
  "picked-up",
  "shipped",
  "out-for-delivery",
  "delivered",
  "delivery-exception",
  "cancelled"
];

function AdminRoutes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const view = searchParams.get("view") || "overview";

  return (
    <div className="section-shell py-10">
      <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-[32px] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Admin dashboard</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Welcome, {user?.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Manage catalog updates, orders, stock, and customer activity from one secure workspace.
          </p>

          <div className="mt-8 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSearchParams({ view: tab.key })}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                  view === tab.key ? "bg-ink text-white" : "bg-slate-50 text-slate-700"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {view === "overview" ? <AdminOverview /> : null}
          {view === "products" ? <AdminProducts /> : null}
          {view === "orders" ? <AdminOrders /> : null}
          {view === "customers" ? <AdminCustomers /> : null}
        </section>
      </div>
    </div>
  );
}

function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api
      .get("/admin/analytics")
      .then((response) => setAnalytics(response.data))
      .catch(() => toast.error("Could not load admin analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PanelCard title="Overview">Loading analytics...</PanelCard>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total orders", value: analytics.metrics.totalOrders },
          { label: "Total revenue", value: formatCurrency(analytics.metrics.totalRevenue) },
          { label: "Total products", value: analytics.metrics.totalProducts },
          { label: "Customers", value: analytics.metrics.totalCustomers }
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">{item.label}</p>
            <p className="mt-4 font-display text-4xl font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <PanelCard title="Low stock alerts">
          <div className="space-y-3">
            {analytics.lowStockProducts.map((product) => (
              <div key={product._id} className="rounded-[22px] bg-slate-50 p-4">
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {product.brand} • {product.stockQuantity} units left
                </p>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Recent orders">
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div key={order._id} className="rounded-[22px] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{order.user?.name || "Customer"}</p>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{formatCurrency(order.totals?.total || 0)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{order.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyProduct);
  const [files, setFiles] = useState([]);

  function loadProducts() {
    setLoading(true);
    api
      .get("/products")
      .then((response) => setProducts(response.data.products))
      .catch(() => toast.error("Could not load products."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price,
      discountPrice: product.discountPrice || "",
      warranty: product.warranty,
      stockQuantity: product.stockQuantity,
      popularityScore: product.popularityScore || 0,
      imageUrls: (product.images || []).join("\n"),
      specifications: (product.specifications || [])
        .map((spec) => `${spec.label}: ${spec.value}`)
        .join("\n"),
      tags: (product.tags || []).join(", "),
      isFeatured: product.isFeatured
    });
    setFiles([]);
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyProduct);
    setFiles([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      files.forEach((file) => {
        formData.append("images", file);
      });

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product updated successfully.");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product created successfully.");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(productId) {
    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted.");
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete product.");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <PanelCard title={editingId ? "Edit product" : "Add product"}>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Product name"],
            ["brand", "Brand"],
            ["category", "Category"],
            ["warranty", "Warranty"],
            ["price", "Price"],
            ["discountPrice", "Discount price"],
            ["stockQuantity", "Stock quantity"],
            ["popularityScore", "Popularity score"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
              <input
                required={["name", "brand", "category", "warranty", "price", "stockQuantity"].includes(key)}
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Short description</label>
            <input
              value={form.shortDescription}
              onChange={(event) => setForm({ ...form, shortDescription: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Product image URLs</label>
            <textarea
              rows={3}
              value={form.imageUrls}
              onChange={(event) => setForm({ ...form, imageUrls: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="One image URL per line"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Specifications</label>
            <textarea
              rows={4}
              value={form.specifications}
              onChange={(event) => setForm({ ...form, specifications: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="Capacity: 9 Kilograms"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
            <input
              value={form.tags}
              onChange={(event) => setForm({ ...form, tags: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="smart tv, family, inverter"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Upload product images</label>
            <input
              multiple
              type="file"
              accept="image/*"
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          <label className="sm:col-span-2 inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
            />
            Mark as featured
          </label>

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-bold text-white"
            >
              {editingId ? <Save size={16} /> : <Plus size={16} />}
              {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </PanelCard>

      <PanelCard title="Catalog">
        {loading ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="rounded-[22px] bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.brand} • {product.category} • {formatCurrency(product.discountPrice || product.price)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                      Stock {product.stockQuantity} • {product.isFeatured ? "Featured" : "Standard"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    api
      .get("/orders/all")
      .then((response) => setOrders(response.data.orders))
      .catch(() => toast.error("Could not load orders."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId, status) {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated.");
      loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update order.");
    }
  }

  return (
    <PanelCard title="Order management">
      {loading ? (
        <p className="text-sm text-slate-500">Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-[24px] bg-slate-50 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="font-semibold text-ink">{order.user?.name || "Customer"}</p>
                  <p className="mt-1 text-sm text-slate-500">{order.user?.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {order.items.length} items • {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-ink">{formatCurrency(order.totals?.total || 0)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Payment {order.payment?.status}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order._id, event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    {["confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/customers")
      .then((response) => setCustomers(response.data.customers))
      .catch(() => toast.error("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PanelCard title="Customer details">
      {loading ? (
        <p className="text-sm text-slate-500">Loading customers...</p>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer._id} className="rounded-[24px] bg-slate-50 p-5">
              <p className="font-semibold text-ink">{customer.name}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.phone || "No phone saved"}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                Joined {formatDate(customer.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

function PanelCard({ title, children }) {
  return (
    <div className="rounded-[32px] bg-white p-7 shadow-soft">
      <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default AdminRoutes;
