import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { deleteUser, getUsers, updateUser } from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-surface via-cyan-50 to-amber-50">
      <AdminNavbar />
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">Manage users</h1>
        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div key={user._id} className="themed-card flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={user.role}
                  onChange={async (event) => {
                    await updateUser(user._id, { ...user, role: event.target.value });
                    loadUsers();
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => deleteUser(user._id).then(loadUsers)}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
