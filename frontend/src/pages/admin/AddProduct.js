import React, { useState } from "react";

function AddProduct() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setImage(reader.result);

    };

    reader.readAsDataURL(file);

  };

  const handleAddProduct = (e) => {

    e.preventDefault();

    if (!name || !price || !image) {
      alert("Fill all required fields");
      return;
    }

    const newProduct = {

      id: Date.now(),

      name,

      price,

      description,

      image

    };

    const existingProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    const updatedProducts = [
      ...existingProducts,
      newProduct
    ];

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    alert("Product added successfully");

    setName("");
    setPrice("");
    setDescription("");
    setImage("");

  };

  return (

    <div>

      <h2>Add Product</h2>

      <form onSubmit={handleAddProduct}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <br /><br />

        {image && (

          <img
            src={image}
            alt="preview"
            width="150"
          />

        )}

        <br /><br />

        <button type="submit">
          Add Product
        </button>

      </form>

    </div>

  );
}

export default AddProduct;
