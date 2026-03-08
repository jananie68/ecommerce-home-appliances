import React from "react";
import { Link } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {

  return (

    <div className="admin-layout">

      {/* Sidebar */}
      <div className="admin-sidebar">

        <h2 className="admin-logo">
          Admin Panel
        </h2>

        <Link to="/admin-dashboard">Dashboard</Link>

        <Link to="/admin/products">Products</Link>

        <Link to="/admin/add-product">Add Product</Link>

        <Link to="/admin/orders">Orders</Link>

        <Link to="/admin/users">Users</Link>

      </div>

      {/* Main Content */}
      <div className="admin-content">

        {children}

      </div>

    </div>

  );

}

export default AdminLayout;
