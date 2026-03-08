import React from "react";
import { useParams } from "react-router-dom";

import fridge from "../assets/images/fridge.jpg";
import washingmachine from "../assets/images/washingmachine.jpg";
import tv from "../assets/images/tv.jpg";
import microwave from "../assets/images/microwave.jpg";
import { useNavigate } from "react-router-dom";

function ProductDetails({ addToCart }) {
    const navigate = useNavigate();

    const buyNow = () => {
    
      navigate("/order-success");
    
    };
    
  const { id } = useParams();

  const products = [
    { id: "1", name: "Refrigerator", price: 25000, image: fridge },
    { id: "2", name: "Washing Machine", price: 18000, image: washingmachine },
    { id: "3", name: "Television", price: 30000, image: tv },
    { id: "4", name: "Microwave Oven", price: 8000, image: microwave }
  ];

  const product = products.find(p => p.id === id);

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (

    <div className="dashboard">

      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px" }}
      />

      <h2>{product.name}</h2>

      <p style={{ fontSize: "20px", color: "green" }}>
        ₹{product.price}
      </p>

      <button
        className="btn"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
      <button
  className="btn"
  style={{ marginLeft: "10px", background: "green" }}
  onClick={buyNow}
>
  Buy Now
</button>


    </div>

  );

}

export default ProductDetails;
