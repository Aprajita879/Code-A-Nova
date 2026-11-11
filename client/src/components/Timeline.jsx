export default function Timeline() {
  const steps = [
    {
      phase: "Phase 1",
      title: "Registrations Open",
      date: "Active Now",
      desc: "Form your team (1-5 members), pick your track, and create your account on Code-a-Nova.",
      status: "active"
    },
    {
      phase: "Phase 2",
      title: "Problem Statement Release",
      date: "01 Nov 2026",
      desc: "Detailed problem tracks, dataset links, and starter kits released to all registered teams.",
      status: "upcoming"
    },
    {
      phase: "Phase 3",
      title: "Registration & PPT Deadline",
      date: "15 Nov 2026",
      desc: "Final deadline to submit project pitch deck (PPT link), prototype link, and complete registration.",
      status: "critical"
    },
    {
      phase: "Phase 4",
      title: "Evaluation & Mentorship",
      date: "20 Nov 2026",
      desc: "Top 20 shortlisted teams receive 1-on-1 mentorship sessions with industry tech leads.",
      status: "upcoming"
    },
    {
      phase: "Phase 5",
      title: "Grand Finale & Winner Pitching",
      date: "28 Nov 2026",
      desc: "Live demo pitching, jury Q&A, and cash prize distribution ceremony.",
      status: "upcoming"
    }
  ];

  return (
    <section id="timeline" className="content-section">
      <div className="section-header">
        <div className="section-badge">Roadmap</div>
        <h2 className="section-title">Event <span className="gradient-text">Timeline</span></h2>
        <p className="section-subtitle">Mark your calendars for key milestones of Code-a-Nova 2026.</p>
      </div>

      <div className="timeline-container">
        {steps.map((step, idx) => (
          <div key={idx} className={`timeline-card status-${step.status}`}>
            <div className="timeline-marker">
              <span className="marker-number">{idx + 1}</span>
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-phase">{step.phase}</span>
                <span className="timeline-date">{step.date}</span>
              </div>
              <h3 className="timeline-title">{step.title}</h3>
              <p className="timeline-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

