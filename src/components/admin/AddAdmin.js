import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./AdminStyles/AddAdmin.css";
import AdminNavbar from "./AdminNavbar";

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const user = userCredential.user;

      await addDoc(collection(db, "admins"), {
        uid: user.uid,
        email: user.email,
        password: password,
        isAdmin: true, 
      });

      alert("Admin added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
    <AdminNavbar />
    <div className="add-admin">
   
      <div className="overlay-aa">
      <form className="form-aa"onSubmit={handleAddAdmin}>
      <h1>Add New Admin</h1>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="submit">Add Admin</button>
        {error && <p>{error}</p>}
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddAdmin;