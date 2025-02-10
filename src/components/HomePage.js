import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import luxuryImg from './assets/luxury-room.jpg';
import spaImg from './assets/spa.jpg';
import diningImg from './assets/dining.jpg';
import { 
  IoBedOutline, 
  IoRestaurantOutline, 
  IoWifiOutline, 
  IoCarSportOutline, 
  IoBusinessOutline 
} from 'react-icons/io5';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/client-login');
  };

  const features = [
    {
      image: luxuryImg,
      title: "Luxury Rooms",
      description: "Experience ultimate comfort in our elegantly designed rooms with modern amenities.",
      delay: "0s"
    },
    {
      image: spaImg,
      title: "Spa & Wellness",
      description: "Rejuvenate your body and mind with our exclusive spa treatments and wellness packages.",
      delay: "0.2s"
    },
    {
      image: diningImg,
      title: "Fine Dining",
      description: "Savor exquisite cuisine prepared by world-class chefs in our signature restaurants.",
      delay: "0.4s"
    }
  ];

  return (
    <div className="homepage">
      <div className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="overlay">
          <h1 className="fade-in">Welcome to Domicile Hotels</h1>
          <p className="fade-in-delay">
            Experience luxury and comfort in the heart of the city. Book your stay with us today and enjoy world-class services at an affordable price.
          </p>
          <button onClick={handleGetStarted} className="get-started-btn pulse">
            Get Started
          </button>
        </div>
      </div>

      <div className="feature-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="feature-cards">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card slide-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className="card-image-container">
                <img src={feature.image} alt={feature.title} />
                <div className="card-overlay">
                  <h3>{feature.title}</h3>
                </div>
              </div>
              <div className="card-content">
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <h3>Domicile Hotels</h3>
          <div className="luxury-container">
            <div className="icon-group">
              <IoBedOutline className="footer-icon" />
              <IoRestaurantOutline className="footer-icon" />
              <IoWifiOutline className="footer-icon" />
              <IoCarSportOutline className="footer-icon" />
              <IoBusinessOutline className="footer-icon" />
            </div>
            <p>Luxury Redefined</p>
            <div className="icon-group">
              <IoBedOutline className="footer-icon" />
              <IoRestaurantOutline className="footer-icon" />
              <IoWifiOutline className="footer-icon" />
              <IoCarSportOutline className="footer-icon" />
              <IoBusinessOutline className="footer-icon" />
            </div>
          </div>
          <button onClick={handleGetStarted} className="footer-cta">
            Book Your Stay Now
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;