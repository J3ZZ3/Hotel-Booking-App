import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import './ClientStyles/ClientLogin.css';


const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      MySwal.fire({
        title: "Login Successful",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
        }, catch (err) {
          MySwal.fire({
            title: 'Login Failed',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Retry',
            customClass: {
              popup: 'custom-popup',
            }
          })
        }
      })
      navigate("/client-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
      <h1 className="login-title">Client Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
        className="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
        className="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      
      <p>Don't have an account? <a href="/client-register">Register</a></p>
   
 
      <p>Are you an admin by chance?<a href="/admin-login">Login</a></p>
    </div>
    </div>
  );
};

export default ClientLogin;