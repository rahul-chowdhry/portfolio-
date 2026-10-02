import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <main className="projects-page">
        <section className="loading-section">
          <div className="premium-loader">
            <span></span>
            <p>Loading Projects...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="projects-page">
        <section className="error-section">

          <span className="section-label">
            PROJECTS
          </span>

          <h1>
            Something went wrong
          </h1>

          <p>{error}</p>

          <Link
            to="/"
            className="primary-button"
          >
            Back Home
          </Link>

        </section>
      </main>
    );
  }

  return (
    <main className="projects-page">

      <section className="premium-page-hero">

        <div className="section-container">

          <div className="premium-hero-copy">

            <span className="section-label">
              PROJECTS
            </span>

            <h1>
              Selected work,
              <span> practical ideas.</span>
            </h1>

            <p>
              Explore development projects and digital work
              built through TECH WORLD.
            </p>

          </div>

          <div className="hero-meta-row">
            <span>TECH WORLD</span>
            <span>WORK / 01</span>
          </div>

        </div>

      </section>

      <section className="section">

        <div className="section-container">

          <div className="section-heading premium-heading">

            <span className="section-label">
              SELECTED WORK / 02
            </span>

            <h2>
              Projects
            </h2>

            <p>
              A collection of development projects and
              digital solutions.
            </p>

          </div>

          {projects.length > 0 ? (

            <div className="premium-project-grid">

              {projects.map((project, index) => (

                <article
                  className={`premium-project-card ${
                    project.featured
                      ? "premium-project-featured"
                      : ""
                  }`}
                  key={project.id}
                >

                  <div className="premium-project-media">

                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                      />
                    ) : (
                      <div className="premium-project-placeholder">
                        <span>
                          PROJECT
                        </span>
                      </div>
                    )}

                    <span className="premium-project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {project.featured && (
                      <span className="premium-project-badge">
                        FEATURED
                      </span>
                    )}

                  </div>

                  <div className="premium-project-content">

                    <h3>
                      {project.title}
                    </h3>

                    {project.short_description && (
                      <p>
                        {project.short_description}
                      </p>
                    )}

                    {project.technologies?.length > 0 && (
                      <div className="premium-tech-list">

                        {project.technologies.map(
                          (technology, techIndex) => (
                            <span key={techIndex}>
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    <div className="premium-project-actions">

                      {project.slug && (
                        <Link
                          to={`/projects/${project.slug}`}
                          className="project-view-button"
                        >
                          View Project →
                        </Link>
                      )}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="project-external-link"
                        >
                          GitHub ↗
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="project-external-link"
                        >
                          Live ↗
                        </a>
                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="premium-empty premium-project-empty">

              <span className="section-label">
                WORK / 02
              </span>

              <h3>
                Projects are coming soon.
              </h3>

              <p>
                Project information will appear here once
                it is added to TECH WORLD.
              </p>

            </div>

          )}

        </div>

      </section>

      <section className="premium-info-strip">

        <div className="section-container">

          <div>

            <span className="section-label">
              WORKFLOW / 03
            </span>

            <h2>
              Idea → Build → Improve.
            </h2>

          </div>

          <p>
            Each project can be shaped around its actual
            requirements, technology and user experience.
          </p>

        </div>

      </section>

      <section className="premium-cta">

        <div className="section-container">

          <span className="section-label">
            YOUR PROJECT
          </span>

          <h2>
            Let's create something useful.
          </h2>

          <p>
            Have an idea or requirement? Let's discuss it.
          </p>

          <Link
            to="/contact"
            className="primary-button"
          >
            Contact Me →
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Projects;