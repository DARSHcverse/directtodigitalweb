import React from "react";
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="hero">
      <div className="container">
        <h1 className="hero-title">D2D Web</h1>
        <p className="hero-subtitle">Designing fast, modern websites for small businesses.</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/quote">Get a Quote</Link>
          <Link className="btn" to="/design">See Designs</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
