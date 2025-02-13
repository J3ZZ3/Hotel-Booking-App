import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import './ClientStyles/ClientLogin.css';
import { useAuth } from '../../context/AuthContext';
import { IoReload } from 'react-icons/io5';

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, loading: authLoading } = useAuth();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/client-dashboard");
    }
  }, [currentUser, navigate, authLoading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await login();
      
      MySwal.fire({
        title: "Login Successful",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        const from = location.state?.from?.pathname || "/client-dashboard";
        navigate(from, { replace: true });
      });
    } catch (err) {
      MySwal.fire({
        title: 'Login Failed',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <IoReload className="loading-icon" />
        <p>Loading...</p>
      </div>
    );
  }

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
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <Link to="/client-register">Register</Link></p>
        <p>Are you an admin by chance? <Link to="/admin-login">Login</Link></p>
      </div>
    </div>
  );
};

export default ClientLogin;