import React from "react";

function Hero() {

  return (

    <div style={{
      background: "linear-gradient(to right, #2563eb, #1e3a8a)",
      color: "white",
      padding: "60px 20px",
      textAlign: "center"
    }}>

      <h1>Welcome to Ecommerce Store</h1>

      <p>Best Home Appliances at Affordable Prices</p>

      <button className="btn" style={{ marginTop: "15px" }}>
        Shop Now
      </button>

    </div>

  );

}

export default Hero;
