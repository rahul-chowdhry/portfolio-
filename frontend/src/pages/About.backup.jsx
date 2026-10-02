import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProfile,
  getSkills,
  getExperience,
  getEducation,
} from "../services/api";

function About() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [
          profileData,
          skillsData,
          experienceData,
          educationData,
        ] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperience(),
          getEducation(),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setExperience(experienceData);
        setEducation(educationData);
      } catch (err) {
        console.error(err);
        setError("Unable to load About page data.");
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <main className="about-page">
        <section className="loading-section">
          <div className="premium-loader">
            <span></span>
            <p>Loading About...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="about-page">
        <section className="error-section">
          <span className="section-label">ABOUT</span>
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <Link to="/" className="primary-button">
            Back Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="about-page">

      <section className="premium-page-hero">
        <div className="section-container">
          <div className="premium-hero-copy">
            <span className="section-label">ABOUT ME</span>

            <h1>
              A little more about
              <span> Rahul Kumar.</span>
            </h1>

            <p>
              Discover my background, skills, experience and
              the technologies I work with.
            </p>
          </div>

          <div className="hero-meta-row">
            <span>TECH WORLD</span>
            <span>PROFILE / 01</span>
          </div>
        </div>
      </section>

      <section className="about-profile-premium section">
        <div className="section-container">
          <div className="about-profile-grid">

            <div className="about-image-premium">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.name}
                />
              ) : (
                <div className="about-image-placeholder">
                  RK
                </div>
              )}
            </div>

            <div className="about-content-premium">
              <span className="section-label">PROFILE</span>

              <h2>{profile?.name}</h2>

              <h3>{profile?.title}</h3>

              <p className="about-main-bio">
                {profile?.bio}
              </p>

              <div className="profile-details">
                {profile?.location && (
                  <div>
                    <span>LOCATION</span>
                    <strong>{profile.location}</strong>
                  </div>
                )}

                {profile?.email && (
                  <div>
                    <span>EMAIL</span>
                    <strong>{profile.email}</strong>
                  </div>
                )}

                <div>
                  <span>STATUS</span>
                  <strong>
                    {profile?.availability
                      ? "Available for work"
                      : "Currently unavailable"}
                  </strong>
                </div>
              </div>

              <div className="about-actions">
                {profile?.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-button"
                  >
                    View Resume ↗
                  </a>
                )}

                <Link
                  to="/contact"
                  className="secondary-button"
                >
                  Contact Me
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section premium-muted-section">
        <div className="section-container">
          <div className="section-heading premium-heading">
            <span className="section-label">TOOLKIT / 02</span>
            <h2>Skills & Technologies</h2>
            <p>
              Tools and technologies I use while building
              digital solutions.
            </p>
          </div>

          {skills.length > 0 ? (
            <div className="premium-skills-grid">
              {skills.map((skill, index) => (
                <div className="premium-skill-card" key={skill.id}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{skill.name}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">
              Skills will be added soon.
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <div className="section-heading premium-heading">
            <span className="section-label">EXPERIENCE / 03</span>
            <h2>Professional Experience</h2>
            <p>
              A timeline of professional experience and
              development work.
            </p>
          </div>

          <div className="premium-timeline">
            {experience.length > 0 ? (
              experience.map((item, index) => (
                <article
                  className="premium-timeline-item"
                  key={item.id}
                >
                  <div className="timeline-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-top">
                      <span>
                        {item.start_date || "Experience"}
                        {item.end_date
                          ? ` — ${item.end_date}`
                          : item.start_date
                            ? " — Present"
                            : ""}
                      </span>
                    </div>

                    <h3>
                      {item.role ||
                        item.job_title ||
                        item.position ||
                        "Professional Experience"}
                    </h3>

                    {item.company && (
                      <h4>{item.company}</h4>
                    )}

                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-message">
                Experience information will be added soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section premium-muted-section">
        <div className="section-container">
          <div className="section-heading premium-heading">
            <span className="section-label">EDUCATION / 04</span>
            <h2>Education</h2>
            <p>
              Academic background and learning journey.
            </p>
          </div>

          <div className="premium-education-grid">
            {education.length > 0 ? (
              education.map((item, index) => (
                <article
                  className="premium-education-card"
                  key={item.id}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>
                    {item.degree ||
                      item.title ||
                      "Education"}
                  </h3>

                  {item.institution && (
                    <h4>{item.institution}</h4>
                  )}

                  {item.start_date && (
                    <p>
                      {item.start_date}
                      {item.end_date
                        ? ` — ${item.end_date}`
                        : ""}
                    </p>
                  )}

                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </article>
              ))
            ) : (
              <p className="empty-message">
                Education information will be added soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="premium-cta">
        <div className="section-container">
          <span className="section-label">NEXT STEP</span>

          <h2>Let's build something useful.</h2>

          <p>
            Have an idea, requirement or project in mind?
            Let's talk about it.
          </p>

          <Link to="/contact" className="primary-button">
            Start a Conversation →
          </Link>
        </div>
      </section>

    </main>
  );
}

export default About;