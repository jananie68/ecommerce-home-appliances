import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();
  
    const users =
      JSON.parse(localStorage.getItem("users")) || [];
  
    const foundUser = users.find(
      u => u.email === email
    );
  
    if (!foundUser) {
      alert("User not found");
      return;
    }
  
    localStorage.setItem(
      "user",
      JSON.stringify(foundUser)
    );
  
    setUser(foundUser);
  
    alert("Login successful");
  
    navigate("/");
  
  };
  

  const handleGoogleLogin = () => {

    const userData = {
      email: "googleuser@gmail.com",
      displayName: "Google User"
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    alert("Google Login successful");

    // Redirect to products
    navigate("/");

  };

  return (

    <div className="auth-container">
  
      <div className="auth-card">
  
        <h2>Login</h2>
  
        <form onSubmit={handleLogin}>
  
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
  
          <button type="submit">
            Login
          </button>
  
        </form>
  
        <div className="auth-divider">
          OR
        </div>
  
        <button
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </button>
  
      </div>
  
    </div>
  
  );
          }  

export default Login;
