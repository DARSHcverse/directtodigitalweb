import React, { useState } from 'react';

function QuotePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    projectType: 'Website',
    budget: '',
    timeline: '',
    details: ''
  });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await fetch('/.netlify/functions/sendQuote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          message: `Project Type: ${form.projectType}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nDetails: ${form.details}`
        })
      });
      if (!res.ok) throw new Error('Failed to send request');
      setStatus({ loading: false, success: 'Thanks! We\'ll reach out soon.', error: null });
      setForm({ name: '', email: '', phoneNumber: '', projectType: 'Website', budget: '', timeline: '', details: '' });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  }

  return (
    <div className="container page">
      <h1 className="page-title">Request a Quote</h1>
      <p className="page-subtitle">Tell us what you need and we\'ll send a tailored estimate.</p>
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="projectType">Project Type</label>
          <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
            <option>Website</option>
            <option>E‑commerce</option>
            <option>Redesign</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="budget">Budget (AUD)</label>
          <input id="budget" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g., 2000-5000" />
        </div>
        <div className="form-row">
          <label htmlFor="timeline">Timeline</label>
          <input id="timeline" name="timeline" value={form.timeline} onChange={handleChange} placeholder="e.g., 4-6 weeks" />
        </div>
        <div className="form-row">
          <label htmlFor="details">Project Details</label>
          <textarea id="details" name="details" rows="5" value={form.details} onChange={handleChange} />
        </div>
        <button type="submit" className="btn primary" disabled={status.loading}>{status.loading ? 'Sending…' : 'Get Estimate'}</button>
        {status.success && <p className="page-subtitle" style={{ color: '#9ae6b4' }}>{status.success}</p>}
        {status.error && <p className="page-subtitle" style={{ color: '#feb2b2' }}>{status.error}</p>}
      </form>
    </div>
  );
}

export default QuotePage;


