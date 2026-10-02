import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProfile,
  getServices,
  getSkills,
  getProjects,
  getSocialLinks,
} from "../services/api";

import ScrollReveal from "../components/ScrollReveal";

function Home() {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [
          profileData,
          servicesData,
          skillsData,
          projectsData,
          socialLinksData,
        ] = await Promise.all([
          getProfile(),
          getServices(),
          getSkills(),
          getProjects(),
          getSocialLinks(),
        ]);

        setProfile(profileData);
        setServices(servicesData);
        setSkills(skillsData);
        setProjects(projectsData);
        setSocialLinks(socialLinksData);
      } catch (err) {
        console.error("HOME API ERROR:", err);

        setError("Unable to load website data.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <main className="home-page">
        <section className="loading-section">
          <p>Loading TECH WORLD...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <section className="error-section">
          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="primary-button"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="home-page">

      {/* HERO */}

      <section className="home-hero">
        <div className="home-hero-container">

          <ScrollReveal direction="left">
            <div className="home-hero-content">

              <span className="section-label">
                TECH WORLD
              </span>

              <h1>
                {profile?.title ||
                  "Building practical digital solutions."}
              </h1>

              <p>
                {profile?.bio ||
                  "Software development, technology and digital solutions."}
              </p>

              <div className="home-hero-actions">

                <Link
                  to="/projects"
                  className="primary-button"
                >
                  View Projects
                </Link>

                <Link
                  to="/contact"
                  className="secondary-button"
                >
                  Contact Me
                </Link>

              </div>

            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <div className="home-profile-card">

              <div className="home-profile-image">

                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name || "Rahul Kumar"}
                  />
                ) : (
                  <div className="home-profile-placeholder">
                    RK
                  </div>
                )}

              </div>

              <div className="home-profile-content">

                <span className="section-label">
                  PROFILE
                </span>

                <h2>
                  {profile?.name || "Rahul Kumar"}
                </h2>

                {profile?.location && (
                  <p>
                    {profile.location}
                  </p>
                )}

                {profile?.availability && (
                  <span className="availability-badge">
                    Available for work
                  </span>
                )}

              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* SERVICES */}

      <section className="section">

        <div className="section-container">

          <ScrollReveal>
            <div className="section-heading">

              <span className="section-label">
                WHAT I DO
              </span>

              <h2>
                Services
              </h2>

              <p>
                Digital services focused on practical
                and useful solutions.
              </p>

            </div>
          </ScrollReveal>


          {services.length > 0 ? (

            <div className="service-grid">

              {services.slice(0, 3).map(
                (service, index) => (

                  <ScrollReveal
                    key={service.id}
                    delay={index * 0.12}
                  >
                    <article className="service-card">

                      <span className="service-card-number">
                        {String(service.id).padStart(2, "0")}
                      </span>

                      <h3>
                        {service.name}
                      </h3>

                      {service.description && (
                        <p>
                          {service.description}
                        </p>
                      )}

                      {service.packages?.length > 0 && (
                        <span className="service-package-count">
                          {service.packages.length} package
                          {service.packages.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      )}

                    </article>
                  </ScrollReveal>

                )
              )}

            </div>

          ) : (

            <ScrollReveal>
              <p className="empty-message">
                Services will be added soon.
              </p>
            </ScrollReveal>

          )}


          <ScrollReveal delay={0.15}>
            <div className="section-action">

              <Link
                to="/services"
                className="text-link"
              >
                View All Services →
              </Link>

            </div>
          </ScrollReveal>

        </div>

      </section>


      {/* SKILLS */}

      <section className="section skills-section">

        <div className="section-container">

          <ScrollReveal>
            <div className="section-heading">

              <span className="section-label">
                MY TOOLKIT
              </span>

              <h2>
                Skills & Technologies
              </h2>

              <p>
                Technologies and tools that I work with.
              </p>

            </div>
          </ScrollReveal>


          {skills.length > 0 ? (

            <ScrollReveal direction="left">

              <div className="skills-list">

                {skills.map((skill) => (

                  <span
                    className="skill-badge"
                    key={skill.id}
                  >
                    {skill.name}
                  </span>

                ))}

              </div>

            </ScrollReveal>

          ) : (

            <ScrollReveal>
              <p className="empty-message">
                Skills will be added soon.
              </p>
            </ScrollReveal>

          )}

        </div>

      </section>


      {/* PROJECTS */}

      <section className="section">

        <div className="section-container">

          <ScrollReveal>
            <div className="section-heading">

              <span className="section-label">
                SELECTED WORK
              </span>

              <h2>
                Projects
              </h2>

              <p>
                A selection of development projects
                and digital work.
              </p>

            </div>
          </ScrollReveal>


          {projects.length > 0 ? (

            <div className="projects-page-grid">

              {projects.slice(0, 3).map(
                (project, index) => (

                  <ScrollReveal
                    key={project.id}
                    delay={index * 0.12}
                  >

                    <article className="project-page-card">

                      {project.thumbnail ? (

                        <div className="project-page-image">

                          <img
                            src={project.thumbnail}
                            alt={project.title}
                          />

                        </div>

                      ) : (

                        <div className="project-page-placeholder">
                          PROJECT
                        </div>

                      )}


                      <div className="project-page-content">

                        <span className="project-number">
                          {String(project.id).padStart(2, "0")}
                        </span>

                        <h3>
                          {project.title}
                        </h3>

                        {project.short_description && (
                          <p>
                            {project.short_description}
                          </p>
                        )}

                        <Link
                          to={`/projects/${project.slug}`}
                          className="project-view-button"
                        >
                          View Project →
                        </Link>

                      </div>

                    </article>

                  </ScrollReveal>

                )
              )}

            </div>

          ) : (

            <ScrollReveal>

              <div className="projects-empty">

                <span className="section-label">
                  PROJECTS
                </span>

                <h3>
                  Projects are coming soon.
                </h3>

                <p>
                  Project information will appear here
                  once it is added to TECH WORLD.
                </p>

              </div>

            </ScrollReveal>

          )}


          {projects.length > 0 && (

            <ScrollReveal delay={0.15}>

              <div className="section-action">

                <Link
                  to="/projects"
                  className="text-link"
                >
                  View All Projects →
                </Link>

              </div>

            </ScrollReveal>

          )}

        </div>

      </section>


      {/* SOCIAL */}

      <section className="social-section">

        <div className="section-container">

          <ScrollReveal direction="left">

            <div className="social-section-content">

              <div>

                <span className="section-label">
                  CONNECT
                </span>

                <h2>
                  Find me online.
                </h2>

                <p>
                  Follow or connect through my social
                  profiles.
                </p>

              </div>


              {socialLinks.length > 0 && (

                <div className="social-links-list">

                  {socialLinks.map(
                    (social, index) => (

                      <ScrollReveal
                        key={social.id}
                        direction="right"
                        delay={index * 0.1}
                      >

                        <a
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link"
                        >

                          <span>
                            {social.icon || social.platform}
                          </span>

                          <strong>
                            {social.platform}
                          </strong>

                          <span>
                            ↗
                          </span>

                        </a>

                      </ScrollReveal>

                    )
                  )}

                </div>

              )}

            </div>

          </ScrollReveal>

        </div>

      </section>


      {/* CTA */}

      <section className="home-cta">

        <ScrollReveal direction="up">

          <div>

            <span className="section-label">
              LET'S WORK TOGETHER
            </span>

            <h2>
              Have a project in mind?
            </h2>

            <p>
              Let's discuss your idea and build
              something useful.
            </p>

            <Link
              to="/contact"
              className="primary-button"
            >
              Contact Me
            </Link>

          </div>

        </ScrollReveal>

      </section>

    </main>
  );
}

export default Home;