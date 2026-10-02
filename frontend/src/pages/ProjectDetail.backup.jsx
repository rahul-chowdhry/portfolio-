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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="project-detail-page">
        <section className="loading-section">

          <div className="premium-loader">
            <span></span>
            <p>
              Loading Project...
            </p>
          </div>

        </section>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-detail-page">

        <section className="error-section">

          <span className="section-label">
            PROJECT
          </span>

          <h1>
            {error || "Project not found."}
          </h1>

          <p>
            The project you are looking for is not
            available.
          </p>

          <Link
            to="/projects"
            className="primary-button"
          >
            Back to Projects
          </Link>

        </section>

      </main>
    );
  }

  return (
    <main className="project-detail-page">

      <section className="project-detail-header">

        <div className="section-container">

          <span className="section-label">
            PROJECT DETAIL
          </span>

          <h1>
            {project.title}
          </h1>

          {project.short_description && (
            <p>
              {project.short_description}
            </p>
          )}

          <div className="hero-meta-row">

            <span>
              TECH WORLD
            </span>

            <span>
              PROJECT / {project.id}
            </span>

          </div>

        </div>

      </section>

      <section className="section">

        <div className="section-container">

          {project.thumbnail && (
            <div className="project-detail-image">
              <img
                src={project.thumbnail}
                alt={project.title}
              />
            </div>
          )}

          <div className="project-detail-grid">

            <div className="project-detail-description">

              <span className="section-label">
                ABOUT THE PROJECT
              </span>

              <h2>
                {project.title}
              </h2>

              {project.full_description ? (
                <p>
                  {project.full_description}
                </p>
              ) : project.short_description ? (
                <p>
                  {project.short_description}
                </p>
              ) : (
                <p>
                  Project details will be added soon.
                </p>
              )}

              {project.features?.length > 0 && (
                <>
                  <h2>
                    Features
                  </h2>

                  <div className="premium-skills-grid">

                    {project.features.map(
                      (feature, index) => (
                        <div
                          className="premium-skill-card"
                          key={index}
                        >
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {feature}
                          </strong>
                        </div>
                      )
                    )}

                  </div>
                </>
              )}

            </div>

            <aside className="project-detail-sidebar">

              {project.technologies?.length > 0 && (
                <div>

                  <span>
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

              {project.github_url && (
                <div>
                  <span>
                    SOURCE
                  </span>

                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    View GitHub ↗
                  </a>
                </div>
              )}

              {project.live_url && (
                <div>
                  <span>
                    LIVE PROJECT
                  </span>

                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Open Website ↗
                  </a>
                </div>
              )}

              <div>
                <span>
                  NAVIGATION
                </span>

                <Link
                  to="/projects"
                  className="text-link"
                >
                  All Projects →
                </Link>
              </div>

            </aside>

          </div>

          {project.gallery?.length > 0 && (
            <div>

              <div className="section-heading premium-heading">
                <span className="section-label">
                  GALLERY
                </span>

                <h2>
                  Project visuals
                </h2>
              </div>

              <div className="project-gallery">

                {project.gallery.map((image) => (
                  <figure key={image.id}>

                    <img
                      src={image.image}
                      alt={
                        image.caption ||
                        project.title
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

            </div>
          )}

        </div>

      </section>

      <section className="premium-cta">

        <div className="section-container">

          <span className="section-label">
            NEXT PROJECT
          </span>

          <h2>
            Have an idea of your own?
          </h2>

          <p>
            Let's discuss what you want to build.
          </p>

          <Link
            to="/contact"
            className="primary-button"
          >
            Start a Conversation →
          </Link>

        </div>

      </section>

    </main>
  );
}

export default ProjectDetail;