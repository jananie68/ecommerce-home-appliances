import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct
} from "../../services/api";
import { getImageUrl } from "../../utils/image";

const emptyProduct = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  brand: "",
  price: "",
  originalPrice: "",
  discountPercentage: 0,
  stock: 0,
  images: [""],
  features: [],
  isFeatured: false
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const loadProducts = async () => {
    const { data } = await getAdminProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("shortDescription", formData.shortDescription);
    payload.append("category", formData.category);
    payload.append("brand", formData.brand);
    payload.append("price", Number(formData.price));
    payload.append("originalPrice", Number(formData.originalPrice || 0));
    payload.append("discountPercentage", Number(formData.discountPercentage || 0));
    payload.append("stock", Number(formData.stock || 0));
    payload.append("images", JSON.stringify(formData.images.filter(Boolean)));
    payload.append("features", JSON.stringify(formData.features.filter(Boolean)));
    payload.append("isFeatured", formData.isFeatured);

    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }

    setFormData(emptyProduct);
    setEditingId(null);
    setSelectedImage(null);
    setPreviewImage("");
    loadProducts();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Manage products</h1>
        <p className="mt-2 text-slate-600">Upload product images from the browser and keep your catalog polished.</p>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">{editingId ? "Edit product" : "Add product"}</h2>
            <div className="mt-6 space-y-4">
              {[
                ["name", "Product name"],
                ["shortDescription", "Short description"],
                ["description", "Full description"],
                ["category", "Category"],
                ["brand", "Brand"],
                ["price", "Price"],
                ["originalPrice", "Original price"],
                ["discountPercentage", "Discount percentage"],
                ["stock", "Stock"],
                ["images.0", "Primary image URL"],
                ["features.0", "Feature 1"],
                ["features.1", "Feature 2"]
              ].map(([field, label]) => {
                const isNested = field.includes(".");
                const [key, index] = field.split(".");
                return (
                  <input
                    key={field}
                    placeholder={label}
                    value={isNested ? formData[key][Number(index)] || "" : formData[field]}
                    onChange={(event) => {
                      if (isNested) {
                        const updated = [...formData[key]];
                        updated[Number(index)] = event.target.value;
                        setFormData((current) => ({ ...current, [key]: updated }));
                        return;
                      }
                      setFormData((current) => ({ ...current, [field]: event.target.value }));
                    }}
                    className="w-full rounded-2xl border border-brand-primary/10 px-4 py-3 shadow-soft outline-none transition focus:border-brand-secondary/50"
                  />
                );
              })}
              <div className="rounded-3xl border border-dashed border-brand-secondary/40 bg-brand-gradient-soft p-4">
                <label className="block text-sm font-semibold text-slate-700">Product image upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                  className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-secondary"
                />
                <p className="mt-2 text-xs text-slate-500">Choose an image from your browser. It will be uploaded to the backend with Multer.</p>
                {(previewImage || formData.images?.[0]) && (
                  <img
                    src={previewImage || getImageUrl(formData.images?.[0])}
                    alt="Preview"
                    className="mt-4 h-40 w-full rounded-2xl object-cover shadow-soft"
                  />
                )}
              </div>
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, isFeatured: event.target.checked }))
                  }
                />
                Feature this product
              </label>
              <button className="gradient-btn w-full">
                {editingId ? "Update product" : "Create product"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="themed-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="h-24 w-24 rounded-2xl object-cover shadow-soft"
                    />
                    <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-brand-secondary">{product.category}</p>
                    <p className="mt-2 font-bold text-brand-primary">Rs. {product.price}</p>
                    <p className="mt-1 text-sm text-slate-500">Stock: {product.stock}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(product._id);
                        setFormData({
                          ...emptyProduct,
                          ...product,
                          images: product.images?.length ? product.images : [""],
                          features: product.features?.length ? product.features : [""]
                        });
                        setSelectedImage(null);
                        setPreviewImage(product.images?.[0] ? getImageUrl(product.images[0]) : "");
                      }}
                      className="ghost-btn px-4 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id).then(loadProducts)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-soft transition hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminProducts;
