import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory
} from "../../services/api";

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  image: "",
  featured: false
};

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyCategory);

  const loadCategories = async () => {
    const { data } = await getAdminCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    if (editingId) {
      await updateCategory(editingId, formData);
    } else {
      await createCategory(formData);
    }
    setFormData(emptyCategory);
    setEditingId(null);
    loadCategories();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Manage categories</h1>
        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <form onSubmit={saveCategory} className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">{editingId ? "Edit category" : "Add category"}</h2>
            <div className="mt-6 space-y-4">
              {["name", "slug", "description", "image"].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={formData[field]}
                  onChange={(event) => setFormData((current) => ({ ...current, [field]: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              ))}
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, featured: event.target.checked }))
                  }
                />
                Featured category
              </label>
              <button className="gradient-btn w-full">
                {editingId ? "Update category" : "Create category"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="themed-card flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(category._id);
                      setFormData(category);
                    }}
                    className="ghost-btn px-4 py-2 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id).then(loadCategories)}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminCategories;
