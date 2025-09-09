import React, { useState } from 'react';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('Thanks! We\'ll get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="container page">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle">Tell us about your project. We typically reply within 1 business day.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn primary">Send Message</button>
      </form>
    </div>
  );
}

export default ContactPage;


