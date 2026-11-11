export default function About() {
  const faqs = [
    {
      q: "Who is eligible to participate?",
      a: "Any undergraduate or postgraduate college student from any stream/branch. Solo developers or teams up to 5 members are welcome."
    },
    {
      q: "Is there any registration fee?",
      a: "No! Code-a-Nova is 100% free for all students to encourage innovation and open collaboration."
    },
    {
      q: "Can team members be from different colleges?",
      a: "Yes, cross-college and interdisciplinary teams (designers + coders + thinkers) are allowed and encouraged."
    },
    {
      q: "What do I need to submit by 15 November 2026?",
      a: "You need to submit your project name, track, slide deck (PPT link), and functional prototype (GitHub / Figma / Live URL)."
    }
  ];

  return (
    <section id="about" className="content-section">
      <div className="section-header">
        <div className="section-badge">About</div>
        <h2 className="section-title">About <span className="gradient-text">Code-A-Nova</span></h2>
        <p className="section-subtitle">A premier national hackathon celebrating student creativity, coding grit, and problem solving.</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="about-icon">💡</div>
          <h3>The Vision</h3>
          <p>
            Code-a-Nova brings together developers, designers, and innovators to build impactful solutions for industry-grade challenges across emerging technology sectors.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon">👥</div>
          <h3>Team Collaboration</h3>
          <p>
            Register solo or form a team of up to 5 members. Dynamically assign roles, collaborate on Git repositories, and iterate on your prototype.
          </p>
        </div>

        <div className="about-card">
          <div className="about-icon">⚖️</div>
          <h3>Judging Criteria</h3>
          <p>
            Submissions are evaluated on 4 parameters: Technical Innovation (30%), Feasibility & Execution (30%), User Experience (20%), and Presentation (20%).
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <h3 className="faq-heading">Frequently Asked Questions</h3>
        <div className="faq-grid">
          {faqs.map((f, i) => (
            <div key={i} className="faq-card">
              <h4 className="faq-q">{f.q}</h4>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

