import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function UserNavbar({ categories = [], search = "", onSearchChange }) {
  const { cart, wishlist, user, logout } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      { label: "Categories", to: "/products" },
      { label: "Deals", to: "/products?sort=featured" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Orders", to: "/orders" }
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50 rounded-lg border-b border-white/60 bg-white/80 text-slate-900 shadow-soft backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4">
        <Link to="/" className="bg-brand-gradient bg-clip-text text-2xl font-bold tracking-wide text-transparent">
          ShopSphere
        </Link>

        <div className="flex min-w-[280px] flex-1 items-center overflow-hidden rounded-full border border-brand-primary/15 bg-white text-slate-900 shadow-soft">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for laptops, appliances, fashion, and more"
            className="w-full border-none px-4 py-3 outline-none"
          />
          <button className="bg-brand-gradient px-5 py-3 font-semibold text-white">Search</button>
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} className="text-sm font-medium text-slate-700 transition hover:text-brand-primary">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/wishlist")}
            className="ghost-btn px-3 py-2 text-sm"
          >
            Wishlist {wishlist.length}
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="gradient-btn px-4 py-2 text-sm"
          >
            Cart {cart.reduce((sum, item) => sum + (item.qty || 1), 0)}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu((value) => !value)}
              className="ghost-btn px-4 py-2 text-sm"
            >
              {user ? `Hi, ${user.name?.split(" ")[0] || "User"}` : "Account"}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-brand-primary/10 bg-white p-2 text-slate-800 shadow-panel">
                {user ? (
                  <>
                    <Link to="/user-dashboard" className="block rounded-xl px-4 py-2 hover:bg-slate-100">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block rounded-xl px-4 py-2 hover:bg-slate-100">
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin-dashboard" className="block rounded-xl px-4 py-2 hover:bg-slate-100">
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block rounded-xl px-4 py-2 hover:bg-slate-100">
                      Login
                    </Link>
                    <Link to="/signup" className="block rounded-xl px-4 py-2 hover:bg-slate-100">
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 pb-3 text-sm text-slate-500">
        {categories.map((category) => (
          <button
            key={category._id || category.name}
            onClick={() => onSearchChange(category.name)}
            className="whitespace-nowrap rounded-full border border-brand-primary/15 bg-white px-3 py-1.5 shadow-soft transition hover:border-brand-secondary/40 hover:text-brand-primary"
          >
            {category.name}
          </button>
        ))}
      </div>
    </header>
  );
}

export default UserNavbar;
