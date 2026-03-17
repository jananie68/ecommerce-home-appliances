import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ cartCount, user, setUser, setCart, search, setSearch }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();



  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowUserMenu(false);
      navigate("/");
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowUserMenu(false);
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

</Link>

 {user && user.email === "admin@gmail.com" && (
  <Link to="/admin-dashboard">
    Admin Panel
  </Link>
)}



        {!user && <Link to="/login">Login</Link>}

        {!user && <Link to="/signup">Signup</Link>}

        {user && (
          <div className="user-menu-container">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              👤 {user.displayName || user.name}
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/user-dashboard" onClick={() => setShowUserMenu(false)}>
                  My Dashboard
                </Link>
                <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                  Profile Settings
                </Link>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>

  );
}

export default Navbar;
