import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoWhite from './images/D2DWhite.png';
import logoColor from './images/d2dlogo.png';

function NavBar() {
  const [logoLoaded, setLogoLoaded] = useState(true);
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className={logoLoaded ? 'brand logo-only' : 'brand'}>
          {logoLoaded && (
            <img
              src={logoWhite || logoColor}
              alt="D2D Web"
              className="brand-logo"
              onError={() => setLogoLoaded(false)}
            />
          )}
          <span className="brand-text">D2D Web</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Home</NavLink>
          <NavLink to="/design" className={({ isActive }) => isActive ? 'active' : undefined}>Design</NavLink>
          <NavLink to="/quote" className={({ isActive }) => isActive ? 'active' : undefined}>Quote</NavLink>
          <NavLink to="/booking" className={({ isActive }) => isActive ? 'active' : undefined}>Booking</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : undefined}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;


