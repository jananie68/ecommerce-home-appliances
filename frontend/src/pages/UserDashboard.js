import React, { useEffect, useState } from "react";
import "./UserDashboard.css";

function UserDashboard() {

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const storedUser =
      JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    setUser(storedUser);

    const allOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(
      allOrders.filter(
        order => order.userEmail === storedUser.email
      )
    );

  }, []);

  if (!user) return <h2>Please login first</h2>;

  return (

    <div className="user-dashboard">

      <h1>Welcome, {user.displayName}</h1>

      <h2>Your Orders</h2>

      {orders.length === 0
        ? <p>No orders yet</p>
        : orders.map((order, i) => (

            <div key={i} className="order-card">

              <p><b>Total:</b> ₹{order.total}</p>

              <p><b>Date:</b> {order.date}</p>

              <p><b>Items:</b> {order.items.length}</p>

            </div>

          ))
      }

    </div>

  );

}

export default UserDashboard;
