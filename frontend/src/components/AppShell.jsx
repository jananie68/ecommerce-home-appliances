import { useEffect, useState } from "react";
import {
  Headset,
  Heart,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingCart,
  ShieldCheck,
  X
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ChatWidget from "./ChatWidget";
import TranslateWidget from "./TranslateWidget";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { logout, user } = useAuth();

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  function submitSearch(event) {
    event.preventDefault();

    const value = searchValue.trim();
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-sand text-slate-900">
      

      <header className={`sticky top-0 z-30 ${isAdminRoute ? "bg-white/90" : "bg-sand/90"} backdrop-blur-xl`}>
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-lg font-black text-white shadow-soft">
                  SP
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-ink sm:text-xl">
                    Sri Palani Andavan Electronics
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Home appliances boutique
                  </p>
                </div>
              </div>
            </Link>

            {!isAdminRoute ? (
              <form onSubmit={submitSearch} className="hidden max-w-xl flex-1 lg:flex">
                <div className="flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-soft">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search refrigerators, washing machines, smart TVs..."
                    className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
                  />
                </div>
              </form>
            ) : null}

            <div className="hidden items-center gap-3 lg:flex">
              {!isAdminRoute ? <TranslateWidget /> : null}
              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft"
                  >
                    <LayoutDashboard size={16} />
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                  Login / Signup
                </Link>
              )}

              {!isAdminRoute ? (
                <>
                  <Link to="/dashboard/wishlist" className="rounded-full border border-slate-200 p-3 text-slate-700">
                    <Heart size={18} />
                  </Link>
                  <Link to="/cart" className="relative rounded-full bg-coral p-3 text-white">
                    <ShoppingCart size={18} />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] font-bold text-coral">
                      {cartCount}
                    </span>
                  </Link>
                </>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {!isAdminRoute ? (
            <nav className="mt-4 hidden items-center gap-7 border-t border-white/60 pt-4 text-sm font-semibold text-slate-600 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "text-coral" : "transition hover:text-ink"
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          ) : null}

          {mobileMenuOpen ? (
            <div className="mt-4 space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft lg:hidden">
              {!isAdminRoute ? (
                <>
                  <form onSubmit={submitSearch}>
                    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                      <Search size={18} className="text-slate-400" />
                      <input
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search appliances..."
                        className="w-full border-none bg-transparent text-sm focus:ring-0"
                      />
                    </div>
                  </form>
                  <div className="space-y-3">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-2xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                  <TranslateWidget />
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-coral px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Cart ({cartCount})
                    </Link>
                    <Link
                      to="/dashboard/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      Wishlist
                    </Link>
                  </div>
                </>
              ) : null}

              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {!isAdminRoute ? (
        <>
          <footer className="mt-20 border-t border-white/60 bg-ink text-slate-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr]">
              <div className="space-y-4">
                <p className="font-display text-2xl font-bold text-white">Sri Palani Andavan Electronics</p>
                <p className="max-w-lg text-sm leading-7">
                  Discover premium home appliances with expert guidance, flexible checkout, trusted warranties,
                  and support built for modern households.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-white">Shop</p>
                <Link to="/products" className="block text-sm hover:text-white">
                  Product catalog
                </Link>
                <Link to="/about" className="block text-sm hover:text-white">
                  About the shop
                </Link>
                <Link to="/contact" className="block text-sm hover:text-white">
                  Contact
                </Link>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-white">Support</p>
                <p className="text-sm">Coimbatore, Tamil Nadu</p>
                <p className="text-sm">support@sripalaniandavan.com</p>
                <p className="text-sm">+91 98765 43210</p>
              </div>
            </div>
          </footer>
          <ChatWidget />
        </>
      ) : null}
    </div>
  );
}

export default AppShell;
