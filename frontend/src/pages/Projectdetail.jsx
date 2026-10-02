import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../services/api";

function ProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProject(slug);
        setProject(data);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 404) {
          setError("Project not found.");
        } else {
          setError("Unable to load project.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <main className="project-detail-page">
        <section className="loading-section">
          <div className="premium-loader">
            <span></span>
            <p>Loading Project...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-detail-page">
        <section className="error-section">
          <span className="section-label">PROJECT</span>

          <h1>{error || "Project not found."}</h1>

          <p>
            The project you are looking for is not
            available.
          </p>

          <Link
            to="/projects"
            className="primary-button"
          >
            ← Back to Projects
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="project-detail-page">

      <section className="project-detail-premium-hero">
        <div className="section-container">

          <Link
            to="/projects"
            className="back-project-link"
          >
            ← Back to Projects
          </Link>

          <div className="project-detail-title-row">
            <div>
              <span className="section-label">
                PROJECT / DETAIL
              </span>

              <h1>{project.title}</h1>

              {project.short_description && (
                <p>{project.short_description}</p>
              )}
            </div>

            {project.featured && (
              <span className="premium-project-badge">
                FEATURED
              </span>
            )}
          </div>

        </div>
      </section>

      <section className="section">
        <div className="section-container">

          {project.thumbnail && (
            <div className="project-detail-premium-image">
              <img
                src={project.thumbnail}
                alt={project.title}
              />
            </div>
          )}

          <div className="project-detail-premium-grid">

            <div className="project-detail-main-content">
              <span className="section-label">
                OVERVIEW / 01
              </span>

              <h2>Project Overview</h2>

              {project.full_description ? (
                <p>{project.full_description}</p>
              ) : project.short_description ? (
                <p>{project.short_description}</p>
              ) : (
                <p>
                  Project description will be added soon.
                </p>
              )}
            </div>

            <aside className="project-detail-premium-sidebar">

              {project.technologies?.length > 0 && (
                <div className="premium-detail-box">
                  <span className="section-label">
                    TECHNOLOGIES
                  </span>

                  <div className="premium-tech-list">
                    {project.technologies.map(
                      (technology, index) => (
                        <span key={index}>
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {project.features?.length > 0 && (
                <div className="premium-detail-box">
                  <span className="section-label">
                    FEATURES
                  </span>

                  <ul className="premium-feature-list">
                    {project.features.map(
                      (feature, index) => (
                        <li key={index}>
                          <span>✓</span>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="project-detail-links">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="project-detail-button"
                  >
                    View on GitHub ↗
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="project-detail-button"
                  >
                    Open Live Project ↗
                  </a>
                )}
              </div>

            </aside>
          </div>

          {project.gallery?.length > 0 && (
            <section className="project-gallery-premium">
              <div className="section-heading premium-heading">
                <span className="section-label">
                  GALLERY / 02
                </span>

                <h2>Project Screenshots</h2>

                <p>
                  Visual details from this project.
                </p>
              </div>

              <div className="project-gallery-grid">
                {project.gallery.map((image) => (
                  <figure
                    className="premium-gallery-item"
                    key={image.id}
                  >
                    <img
                      src={image.image}
                      alt={
                        image.caption ||
                        `${project.title} screenshot`
                      }
                    />

                    {image.caption && (
                      <figcaption>
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

        </div>
      </section>

      <section className="premium-cta">
        <div className="section-container">
          <span className="section-label">
            NEXT PROJECT
          </span>

          <h2>Have an idea of your own?</h2>

          <p>
            Let's discuss your requirement and create a
            practical solution.
          </p>

          <Link to="/contact" className="primary-button">
            Start a Conversation →
          </Link>
        </div>
      </section>

    </main>
  );
}

export default ProjectDetail;