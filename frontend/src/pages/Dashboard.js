import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ userRole }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    link: ''
  });

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
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([...projects, response.data]);
      setFormData({ title: '', description: '', technologies: '', link: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Role: <strong>{userRole}</strong></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {userRole === 'ADMIN' && (
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Project'}
        </button>
      )}

      {showForm && userRole === 'ADMIN' && (
        <form className="project-form" onSubmit={handleAddProject}>
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Enter project description"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="technologies">Technologies (comma separated)</label>
            <input
              type="text"
              id="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Project Link</label>
            <input
              type="url"
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <button type="submit" className="btn btn-success">Save Project</button>
        </form>
      )}

      <div className="projects-section">
        <h3>My Projects</h3>
        {loading ? (
          <p className="loading">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="no-data">No projects found.</p>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.technologies && project.technologies.split(',').map((tech, idx) => (
                    <span key={idx} className="tag">{tech.trim()}</span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project →
                  </a>
                )}
                {userRole === 'ADMIN' && (
                  <button className="btn btn-danger" onClick={() => handleDeleteProject(project.id)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
