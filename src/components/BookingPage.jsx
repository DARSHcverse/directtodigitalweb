import React, { useState } from 'react';

function BookingPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', service: 'Website Design', message: '' });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await fetch('/.netlify/functions/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          service: form.service,
          message: form.message
        })
      });
      if (!res.ok) throw new Error('Failed to submit booking');
      setStatus({ loading: false, success: 'Thanks! We\'ll confirm by email shortly.', error: null });
      setForm({ fullName: '', email: '', phoneNumber: '', service: 'Website Design', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  }

  return (
    <div className="container page">
      <h1 className="page-title">Book a Call</h1>
      <p className="page-subtitle">We\'ll follow up to lock in the details.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="service">Service</label>
          <select id="service" name="service" value={form.service} onChange={handleChange}>
            <option>Website Design</option>
            <option>Website Redesign</option>
            <option>E‑commerce</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="message">Notes</label>
          <textarea id="message" name="message" rows="4" value={form.message} onChange={handleChange} />
        </div>
        <button type="submit" className="btn primary" disabled={status.loading}>{status.loading ? 'Sending…' : 'Request Booking'}</button>
        {status.success && <p className="page-subtitle" style={{ color: '#9ae6b4' }}>{status.success}</p>}
        {status.error && <p className="page-subtitle" style={{ color: '#feb2b2' }}>{status.error}</p>}
      </form>
    </div>
  );
}

export default BookingPage;


