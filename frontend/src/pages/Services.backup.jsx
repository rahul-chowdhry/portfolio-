import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <main className="services-page">
        <section className="loading-section">
          <div className="premium-loader">
            <span></span>
            <p>Loading Services...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="services-page">
        <section className="error-section">
          <span className="section-label">SERVICES</span>
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
    <main className="services-page">

      <section className="premium-page-hero">
        <div className="section-container">
          <div className="premium-hero-copy">
            <span className="section-label">SERVICES</span>

            <h1>
              Digital solutions
              <span> built around your needs.</span>
            </h1>

            <p>
              Explore available services, packages and
              pricing through TECH WORLD.
            </p>
          </div>

          <div className="hero-meta-row">
            <span>TECH WORLD</span>
            <span>SERVICES / 01</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-container">

          <div className="section-heading premium-heading">
            <span className="section-label">
              WHAT I DO / 02
            </span>

            <h2>Services & Packages</h2>

            <p>
              Select a service to explore its available
              packages and features.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="premium-service-list">
              {services.map((service, serviceIndex) => (
                <article
                  className="premium-service-block"
                  key={service.id}
                >
                  <div className="premium-service-header">
                    <div className="service-index">
                      {String(serviceIndex + 1).padStart(2, "0")}
                    </div>

                    <div className="service-heading-copy">
                      <span className="section-label">
                        SERVICE
                      </span>

                      <h3>{service.name}</h3>

                      {service.description && (
                        <p>{service.description}</p>
                      )}
                    </div>

                    {service.icon && (
                      <div className="premium-service-icon">
                        {service.icon}
                      </div>
                    )}
                  </div>

                  {service.packages?.length > 0 ? (
                    <div className="premium-package-grid">
                      {service.packages.map((pkg, index) => (
                        <article
                          className={`premium-package ${
                            pkg.is_featured
                              ? "premium-package-featured"
                              : ""
                          }`}
                          key={pkg.id}
                        >
                          <div className="package-topline">
                            <span>
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {pkg.is_featured && (
                              <b>FEATURED</b>
                            )}
                          </div>

                          <h4>{pkg.name}</h4>

                          {pkg.short_description && (
                            <p>
                              {pkg.short_description}
                            </p>
                          )}

                          <div className="premium-price">
                            {pkg.price !== null &&
                            pkg.price !== undefined ? (
                              <strong>
                                ₹{pkg.price}
                              </strong>
                            ) : (
                              <strong>Custom</strong>
                            )}

                            {pkg.price_label && (
                              <span>
                                {pkg.price_label}
                              </span>
                            )}
                          </div>

                          {pkg.features?.length > 0 && (
                            <ul>
                              {pkg.features.map(
                                (feature, featureIndex) => (
                                  <li key={featureIndex}>
                                    <span>✓</span>
                                    {feature}
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                          <Link
                            to="/contact"
                            className="package-button"
                          >
                            Get Started →
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-message">
                      Packages will be added soon.
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="premium-empty">
              <span className="section-label">SERVICES</span>
              <h3>Services are coming soon.</h3>
              <p>
                Service information will appear here once
                it is added to TECH WORLD.
              </p>
            </div>
          )}

        </div>
      </section>

      <section className="premium-info-strip">
        <div className="section-container">
          <div>
            <span className="section-label">APPROACH / 03</span>
            <h2>Simple. Clear. Practical.</h2>
          </div>

          <p>
            Every project starts with understanding the
            requirement. The focus is on creating useful,
            responsive and maintainable digital solutions.
          </p>
        </div>
      </section>

      <section className="premium-cta">
        <div className="section-container">
          <span className="section-label">START A PROJECT</span>

          <h2>Have an idea?</h2>

          <p>
            Tell me what you need and let's discuss the
            next step.
          </p>

          <Link to="/contact" className="primary-button">
            Contact Me →
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Services;