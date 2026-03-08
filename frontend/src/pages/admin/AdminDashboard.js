import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    setUsers(
      JSON.parse(localStorage.getItem("users")) || []
    );

    setProducts(
      JSON.parse(localStorage.getItem("products")) || []
    );

    setOrders(
      JSON.parse(localStorage.getItem("orders")) || []
    );

  }, []);

  const revenue = orders.reduce(
    (sum, order) => sum + order.total, 0
  );

  return (

    <div className="dashboard">

      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card users">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="card products">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card orders">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card revenue">
          <h3>Total Revenue</h3>
          <p>₹{revenue}</p>
        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;
