import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products({ addToCart }) {

  const [products, setProducts] = useState([]);

  const loadProducts = () => {

    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    setProducts(storedProducts);

  };

  useEffect(() => {

    loadProducts();

    // reload when page gains focus
    window.addEventListener("focus", loadProducts);

    return () => {
      window.removeEventListener("focus", loadProducts);
    };

  }, []);

  if (products.length === 0) {

    return (
      <div style={{ padding: "40px" }}>
        <h2>No products available.</h2>
        <p>Admin needs to add products.</p>
      </div>
    );

  }

  return (

    <div style={{
      padding: "20px",
      background: "#f3f4f6",
      minHeight: "100vh"
    }}>

      <h2>Available Products</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>

        {products.map(product => (

          <div
            key={product.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >

            <Link to={`/product/${product.id}`}>

              <img
                src={product.image}
                alt=""
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover"
                }}
              />

              <h3>{product.name}</h3>

            </Link>

            <p style={{
              color: "#B12704",
              fontWeight: "bold"
            }}>
              ₹{product.price}
            </p>

            <button
              className="btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Products;
