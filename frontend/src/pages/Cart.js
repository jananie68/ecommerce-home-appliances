import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {

  const navigate = useNavigate();

  // Get logged user safely
  const user = JSON.parse(localStorage.getItem("user"));

  // Calculate total price safely
  const total = cart && cart.length > 0
    ? cart.reduce((sum, item) => sum + item.price, 0)
    : 0;


  // Remove item from cart
  const removeItem = (index) => {

    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    setCart(updatedCart);

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  // Place order function
  const placeOrder = () => {

    // Check login
    if (!user) {

      alert("Please login first");

      navigate("/login");

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

      total: total,

      date: new Date().toLocaleString()

    };

    // Get existing orders
    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    // Add new order
    existingOrders.push(newOrder);

    // Save orders
    localStorage.setItem(
      "orders",
      JSON.stringify(existingOrders)
    );

    alert("Order placed successfully");

    // Clear cart
    setCart([]);

    localStorage.removeItem("cart");

    // Redirect
    navigate("/user-dashboard");
  };


  // Empty cart UI
  if (!cart || cart.length === 0) {

    return (

      <div style={{ padding: "40px", textAlign: "center" }}>

        <h2>Your Cart is Empty</h2>

        <button
          className="btn"
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            background: "#007bff",
            color: "white"
          }}
        >
          Continue Shopping
        </button>

      </div>

    );
  }


  // Main cart UI
  return (

    <div style={{ padding: "20px" }}>

      <h2>Your Cart</h2>

      {cart.map((item, index) => (

        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <div>

            <h3>{item.name}</h3>

            <p style={{ color: "#B12704", fontWeight: "bold" }}>
              ₹{item.price}
            </p>

          </div>

          <button
            className="btn"
            style={{
              background: "red",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => removeItem(index)}
          >
            Remove
          </button>

        </div>

      ))}


      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          borderTop: "2px solid #ddd"
        }}
      >

        <h2>Total: ₹{total}</h2>

        <button
          className="btn"
          style={{
            marginTop: "10px",
            background: "green",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={placeOrder}
        >
          Buy Now
        </button>

      </div>

    </div>

  );

}

export default Cart;
