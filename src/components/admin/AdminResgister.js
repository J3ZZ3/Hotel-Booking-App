import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const predefinedSecretCode = "adminSecretCode123";

  const handleRegister = async (e) => {
    e.preventDefault();
    if (secretCode !== predefinedSecretCode) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid admin code. Please try again.",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "admins", user.uid), {
        uid: user.uid,
        email: user.email,
        isAdmin: true,
      });

      setSuccess("Admin registered successfully!");
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Admin registered successfully!",
      });
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message,
      });
      console.error("Error registering admin: ", err);
    }
  };

  return (
    <div>
      <h1>Register as Admin</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Code"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default AdminRegister;
