import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ClientRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        password: password,
        role: "client",
        isAdmin: false // Default role is "client"
      });

      // Redirect to Client Login
      navigate("/client-login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Client Registration</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      <p>Already have an account? <a href="/client-login">Login</a></p>
    </div>
  );
};

export default ClientRegister;