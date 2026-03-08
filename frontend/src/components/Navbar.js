import React from "react";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ cartCount, user, setUser, setCart, search, setSearch })

 {



  const logout = () => {

    signOut(auth).then(() => {
  
      setUser(null);
  
      localStorage.removeItem("user");
  
    });
  
  };
  
  
  

  return (

    <div className="navbar">

      <h2 className="logo">Ecommerce</h2>

      {/* Search Bar */}
      <input
  type="text"
  placeholder="Search products..."
  className="search-bar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>


      <div className="nav-links">

        <Link to="/">Products</Link>

        <Link to="/cart" className="cart-link">

  Cart

  {cartCount > 0 && (
    <span className="cart-badge">
      {cartCount}
    </span>
  )}
 {user && user.email === "admin@gmail.com" && (
  <Link to="/admin-dashboard">
    Admin Panel
  </Link>
)}



</Link>



        {!user && <Link to="/login">Login</Link>}

        {!user && <Link to="/signup">Signup</Link>}

        {user && (
          <>
            <span>Hello, {user.displayName}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}

      </div>

    </div>

  );
}

export default Navbar;
