import React from "react";
import { useNavigate } from "react-router-dom";

function OrderPage({ cart, user, setCart }) {

  const navigate = useNavigate();

  const placeOrder = () => {

    if (!user) {

      alert("Please login first");

      return;

    }

    if (cart.length === 0) {

      alert("Cart is empty");

      return;

    }

    const newOrder = {

      id: Date.now(),

      userEmail: user.email,

      items: cart,

      total: cart.reduce(
        (sum, item) => sum + Number(item.price),
        0
      ),

      date: new Date().toLocaleString()

    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    existingOrders.push(newOrder);

    localStorage.setItem(
      "orders",
      JSON.stringify(existingOrders)
    );

    setCart([]);

    alert("Order placed successfully");

    navigate("/user-dashboard");

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Confirm Order</h2>

      <button className="btn" onClick={placeOrder}>
        Place Order
      </button>

    </div>

  );

}

export default OrderPage;
