import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {

    e.preventDefault();
  
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }
  
    const newUser = {
      email,
      displayName: email.split("@")[0],
      createdAt: new Date().toLocaleString()
    };
  
    // get existing users
    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];
  
    // check duplicate
    const userExists = existingUsers.find(
      u => u.email === email
    );
  
    if (userExists) {
      alert("User already exists");
      return;
    }
  
    // add new user
    existingUsers.push(newUser);
  
    localStorage.setItem(
      "users",
      JSON.stringify(existingUsers)
    );
  
    // login user
    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );
  
    setUser(newUser);
  
    alert("Signup successful");
  
    navigate("/");
  
  };
  

  const handleGoogleSignup = () => {

    const userData = {
      email: "googleuser@gmail.com",
      displayName: "Google User"
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    navigate("/");

  };
  

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

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
            Signup
          </button>

        </form>

        <div className="auth-divider">
          OR
        </div>

        <button
          className="google-btn"
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </button>

      </div>

    </div>

  );

}

export default Signup;
