import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage.jsx';
import DesignPage from './components/DesignPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import QuotePage from './components/QuotePage.jsx';
import BookingPage from './components/BookingPage.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
