import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h2>My Portfolio</h2>
        <p>A showcase of my projects and technical expertise</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="portfolio-section">
        {loading ? (
          <p className="loading">Loading portfolio...</p>
        ) : projects.length === 0 ? (
          <p className="no-data">No projects in portfolio yet.</p>
        ) : (
          <div className="portfolio-grid">
            {projects.map(project => (
              <div key={project.id} className="portfolio-item">
                <div className="portfolio-item-content">
                  <h3>{project.title}</h3>
                  <p className="description">{project.description}</p>
                  {project.technologies && (
                    <div className="technologies">
                      <strong>Technologies:</strong>
                      <div className="tech-list">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="tech-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                      Visit Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
