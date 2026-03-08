import React from "react";
import { Link, Outlet } from "react-router-dom";

function AdminLayout() {

  return (

    <div style={{ display: "flex" }}>

      <div style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        minHeight: "100vh",
        padding: "20px"
      }}>

        <h2>Admin Panel</h2>

        <Link to="/admin-dashboard" className="admin-link">
          Dashboard
        </Link>

        <Link to="/admin-products" className="admin-link">
          Products
        </Link>

        <Link to="/admin-add-product" className="admin-link">
          Add Product
        </Link>

        <Link to="/admin-orders" className="admin-link">
          Orders
        </Link>

        <Link to="/admin-users" className="admin-link">
          Users
        </Link>

      </div>

      <div style={{
        flex: 1,
        padding: "20px"
      }}>

        <Outlet />

      </div>

    </div>

  );

}

export default AdminLayout;
