import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import { getProfile, updateProfile } from "../services/api";

function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
          }
        });
      })
      .catch((error) => console.error("Failed to load profile", error));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    await updateProfile(formData);
    setMessage("Profile updated successfully");
  };

  return (
    <div className="min-h-screen">
      <UserNavbar categories={[]} search="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={saveProfile} className="themed-card p-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile settings</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <input
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              placeholder="Full name"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={formData.phone}
              onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone number"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={formData.address.street}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  address: { ...current.address, street: event.target.value }
                }))
              }
              placeholder="Street address"
              className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2"
            />
            <input
              value={formData.address.city}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  address: { ...current.address, city: event.target.value }
                }))
              }
              placeholder="City"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={formData.address.state}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  address: { ...current.address, state: event.target.value }
                }))
              }
              placeholder="State"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={formData.address.postalCode}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  address: { ...current.address, postalCode: event.target.value }
                }))
              }
              placeholder="Postal code"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={formData.address.country}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  address: { ...current.address, country: event.target.value }
                }))
              }
              placeholder="Country"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
          </div>
          {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
          <button className="gradient-btn mt-6 px-6 py-3">
            Save changes
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfileSettings;
