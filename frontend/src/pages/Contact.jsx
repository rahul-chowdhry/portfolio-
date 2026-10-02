import { useState } from "react";
import { Link } from "react-router-dom";
import { sendContactMessage } from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendContactMessage(formData);

      setSuccess(
        "Your message has been sent successfully."
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        const data = err.response.data;

        const messages = Object.values(data)
          .flat()
          .join(" ");

        setError(
          messages ||
          "Unable to send your message."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      <section className="premium-page-hero">

        <div className="section-container">

          <div className="premium-hero-copy">

            <span className="section-label">
              CONTACT
            </span>

            <h1>
              Let's talk about
              <span> your next project.</span>
            </h1>

            <p>
              Share your idea, requirement or project details
              and start a conversation.
            </p>

          </div>

          <div className="hero-meta-row">
            <span>TECH WORLD</span>
            <span>CONTACT / 01</span>
          </div>

        </div>

      </section>

      <section className="section">

        <div className="section-container">

          <div className="premium-contact-grid">

            <div className="premium-contact-info">

              <span className="section-label">
                GET IN TOUCH / 02
              </span>

              <h2>
                Tell me what
                <span> you have in mind.</span>
              </h2>

              <p>
                Whether you have a project idea, development
                requirement or a question, send a message
                through the form.
              </p>

              <div className="contact-detail-card">

                <span>
                  TECH WORLD
                </span>

                <strong>
                  Software development, technology and
                  digital solutions.
                </strong>

              </div>

              <Link
                to="/services"
                className="text-link"
              >
                Explore Services →
              </Link>

            </div>

            <div className="premium-contact-form-card">

              <div className="form-card-header">

                <span className="section-label">
                  MESSAGE / 03
                </span>

                <h3>
                  Send a message
                </h3>

                <p>
                  Fill in the details below.
                </p>

              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                <div className="form-row">

                  <div className="form-group">

                    <label htmlFor="name">
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows="7"
                    required
                  />

                </div>

                {success && (
                  <div className="form-success">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Message →"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

      <section className="contact-bottom premium-muted-section">

        <div className="section-container">

          <span className="section-label">
            TECH WORLD / 04
          </span>

          <h2>
            Build.
            <span> Improve.</span>
            Grow.
          </h2>

          <p>
            Practical digital solutions designed around
            actual requirements.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Contact;