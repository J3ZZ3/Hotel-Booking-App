import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import luxuryImg from './assets/luxury-room.jpg';
import spaImg from './assets/spa.jpg';
import diningImg from './assets/dining.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/client-login');
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="overlay">
          <h1>Welcome to Domicile Hotels</h1>
          <p>
            Experience luxury and comfort in the heart of the city. Book your stay with us today and enjoy world-class services at an affordable price.
          </p>
          <button onClick={handleGetStarted} className="get-started-btn">
            Get Started
          </button>
        </div>
      </div>

      <div className="feature-section">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="card">
            <img src={luxuryImg} alt="Luxury Rooms" />
            <h3>Luxury Rooms</h3>
            <p>Enjoy elegantly designed rooms with all the modern amenities.</p>
          </div>

          <div className="card">
            <img src={spaImg} alt="Spa & Wellness" />
            <h3>Spa & Wellness</h3>
            <p>Unwind with our exclusive spa treatments and wellness packages.</p>
          </div>

          <div className="card">
            <img src={diningImg} alt="Fine Dining" />
            <h3>Fine Dining</h3>
            <p>Indulge in gourmet cuisine at our in-house restaurants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;