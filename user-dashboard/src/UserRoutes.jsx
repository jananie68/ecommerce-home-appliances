import { useEffect, useState } from "react";
import { Heart, Package, Settings, ShoppingBag, UserCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ShipmentTrackerCard from "@/components/ShipmentTrackerCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, getAssetUrl } from "@/lib/api";
import { formatCurrency, formatDate, formatDateTime, formatStatusLabel } from "@/lib/format";

const tabs = [
  { key: "overview", label: "Overview", icon: ShoppingBag },
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "profile", label: "Profile", icon: UserCircle2 }
];

function UserRoutes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const view = searchParams.get("view") || "overview";

  return (
    <div className="section-shell py-10">
      <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-[32px] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">User dashboard</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Hello, {user?.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Review your orders, wishlist, saved profile details, and warranty-friendly shopping activity.
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

          <div className="mt-6 rounded-[24px] bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Settings className="text-coral" size={18} />
              <div>
                <p className="text-sm font-semibold text-ink">Need more products?</p>
                <Link to="/products" className="text-sm text-coral">
                  Browse the catalog
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          {view === "overview" ? <UserOverview /> : null}
          {view === "orders" ? <UserOrders /> : null}
          {view === "wishlist" ? <UserWishlist /> : null}
          {view === "profile" ? <UserProfile /> : null}
        </section>
      </div>
    </div>
  );
}

function UserOverview() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api
      .get("/users/dashboard")
      .then((response) => setDashboard(response.data))
      .catch(() => toast.error("Could not load your dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PanelCard title="Overview">Loading your dashboard...</PanelCard>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Total orders", value: dashboard.stats.totalOrders },
          { label: "Wishlist items", value: dashboard.stats.wishlistCount },
          { label: "Saved addresses", value: dashboard.stats.savedAddresses }
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">{item.label}</p>
            <p className="mt-4 font-display text-4xl font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <PanelCard title="Recent orders">
        <div className="space-y-3">
          {dashboard.recentOrders.length ? (
            dashboard.recentOrders.map((order) => (
              <div key={order._id} className="rounded-[22px] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{order.items.length} item(s)</p>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{formatCurrency(order.totals?.total || 0)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatStatusLabel(order.status)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No orders yet. Your next appliance is waiting in the catalog.</p>
          )}
        </div>
      </PanelCard>
    </div>
  );
}

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((response) => setOrders(response.data.orders))
      .catch(() => toast.error("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PanelCard title="Order history and tracking">
      {loading ? (
        <p className="text-sm text-slate-500">Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <div key={order._id} className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {`Placed ${formatDateTime(order.createdAt)} | ${order.items.length} items | Payment ${order.payment?.status}`}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-ink">{formatCurrency(order.totals?.total || 0)}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-coral">{formatStatusLabel(order.status)}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <ShipmentTrackerCard order={order} showItems />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">You haven't placed any orders yet.</p>
          )}
        </div>
      )}
    </PanelCard>
  );
}

function UserWishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  function loadWishlist() {
    setLoading(true);
    api
      .get("/users/wishlist")
      .then((response) => setProducts(response.data.products))
      .catch(() => toast.error("Could not load wishlist."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function removeFromWishlist(productId) {
    try {
      await toggleWishlist(productId);
      toast.success("Wishlist updated.");
      loadWishlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update wishlist.");
    }
  }

  return (
    <PanelCard title="Wishlist">
      {loading ? (
        <p className="text-sm text-slate-500">Loading wishlist...</p>
      ) : products.length ? (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col gap-5 rounded-[24px] bg-slate-50 p-5 md:flex-row">
              <img src={getAssetUrl(product.images?.[0])} alt={product.name} className="h-40 w-full rounded-[22px] object-cover md:w-40" />
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{product.brand}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink">{product.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{formatCurrency(product.discountPrice || product.price)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="rounded-full bg-coral px-4 py-3 text-sm font-bold text-white"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product._id)}
                    className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Remove
                  </button>
                  <Link to={`/products/${product._id}`} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No wishlist items yet. Save products you want to revisit here.</p>
      )}
    </PanelCard>
  );
}

function UserProfile() {
  const { updateProfile, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.addressBook?.[0] || {
      fullName: user?.name || "",
      phone: user?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: ""
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        addressBook: [form.address]
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelCard title="Profile">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value, address: { ...form.address, phone: event.target.value } })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </div>

        {[
          ["fullName", "Address contact name"],
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
              value={form.address[key] || ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  address: {
                    ...form.address,
                    [key]: event.target.value
                  }
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Update profile"}
          </button>
        </div>
      </form>
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

export default UserRoutes;
