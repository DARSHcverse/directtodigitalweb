import React from 'react';

const sampleProjects = [
  { id: 1, title: 'Modern Portfolio', description: 'Clean, minimal portfolio layout.' },
  { id: 2, title: 'E‑Commerce Store', description: 'Fast, conversion‑focused storefront.' },
  { id: 3, title: 'Restaurant Site', description: 'Menu, bookings, and gallery.' },
  { id: 4, title: 'SaaS Landing', description: 'Hero, features, and pricing.' },
  { id: 5, title: 'Blog/Magazine', description: 'Content‑first, SEO‑ready blog.' },
  { id: 6, title: 'Local Business', description: 'Services, testimonials, contact.' }
];

function DesignPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Design Showcase</h1>
      <p className="page-subtitle">A peek at styles and layouts we can build for you.</p>
      <div className="grid">
        {sampleProjects.map(project => (
          <div key={project.id} className="card">
            <div className="mockup" />
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignPage;


