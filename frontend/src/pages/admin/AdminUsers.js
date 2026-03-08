import React, { useEffect, useState } from "react";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(storedUsers);

  }, []);

  return (

    <div>

      <h2>All Users ({users.length})</h2>

      {users.length === 0 ? (

        <p>No users found</p>

      ) : (

        users.map((user, index) => (

          <div key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}>

            <p><b>Email:</b> {user.email}</p>

            <p><b>Name:</b> {user.displayName}</p>

            <p><b>Created:</b> {user.createdAt}</p>

          </div>

        ))

      )}

    </div>

  );

}

export default AdminUsers;
