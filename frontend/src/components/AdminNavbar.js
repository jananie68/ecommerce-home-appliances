import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function AdminNavbar() {
  const { logout, user } = useStore();
  const navigate = useNavigate();
  const links = [
    { label: "Dashboard", to: "/admin-dashboard" },
    { label: "Products", to: "/admin-products" },
    { label: "Orders", to: "/admin-orders" },
    { label: "Users", to: "/admin-users" },
    { label: "Analytics", to: "/admin-analytics" },
    { label: "Notifications", to: "/admin-orders" },
    { label: "Categories", to: "/admin-categories" }
  ];

  return (
    <aside className="min-h-screen w-full max-w-xs bg-brand-gradient p-6 text-white shadow-panel">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-white/80">Admin Hub</p>
        <h1 className="mt-2 text-3xl font-bold">ShopSphere</h1>
        <p className="mt-2 text-sm text-white/80">Manage catalog, orders, inventory, and growth.</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-white text-brand-primary shadow-soft" : "hover:bg-white/15"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
        <p className="text-sm text-white/80">Signed in as</p>
        <p className="mt-1 font-semibold">{user?.name || "Admin User"}</p>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-soft"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default AdminNavbar;
