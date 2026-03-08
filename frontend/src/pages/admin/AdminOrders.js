import React, { useEffect, useState } from "react";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(storedOrders);
  }, []);

  return (

    <div>

      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (

        orders.map((order, index) => (

          <div key={index} className="order-card">

            <p>User: {order.userEmail}</p>
            <p>Total: ₹{order.total}</p>
            <p>Date: {order.date}</p>
            <p>Items: {order.items.length}</p>

          </div>

        ))

      )}

    </div>

  );
}

export default AdminOrders;
