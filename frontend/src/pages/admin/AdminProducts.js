import React, { useEffect, useState } from "react";

function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  const deleteProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditProduct(products[index]);
  };

  const saveEdit = () => {
    const updated = [...products];
    updated[editIndex] = editProduct;

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));

    setEditIndex(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Manage Products</h2>

      {products.length === 0 && <p>No products available</p>}

      {products.map((product, index) => (

        <div
          key={index}
          style={{
            background: "white",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            gap: "20px"
          }}
        >

          <img
            src={product.image}
            alt=""
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />

          <div style={{ flex: 1 }}>

            {editIndex === index ? (
              <>
                <input
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      name: e.target.value
                    })
                  }
                  placeholder="Name"
                />

                <input
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      price: e.target.value
                    })
                  }
                  placeholder="Price"
                />

                <input
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value
                    })
                  }
                  placeholder="Description"
                />

                <br /><br />

                <button
                  onClick={saveEdit}
                  style={{
                    background: "green",
                    color: "white",
                    marginRight: "10px"
                  }}
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  style={{
                    background: "gray",
                    color: "white"
                  }}
                >
                  Cancel
                </button>

              </>
            ) : (
              <>
                <h3>{product.name}</h3>

                <p>₹{product.price}</p>

                <p>{product.description}</p>

                <button
                  onClick={() => startEdit(index)}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    marginRight: "10px"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(index)}
                  style={{
                    background: "red",
                    color: "white"
                  }}
                >
                  Delete
                </button>
              </>
            )}

          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminProducts;
