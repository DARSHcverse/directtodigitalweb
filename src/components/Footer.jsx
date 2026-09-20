import React from "react";
import '../App.css'

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>© {year} D2D Web. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
