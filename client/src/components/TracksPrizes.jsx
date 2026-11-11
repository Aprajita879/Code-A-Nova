export default function TracksPrizes() {
  const tracks = [
    {
      icon: "🤖",
      title: "AI & Machine Learning",
      desc: "LLMs, Computer Vision, predictive analytics, autonomous agents, and generative workflows."
    },
    {
      icon: "🔗",
      title: "Web3 & Blockchain",
      desc: "DeFi protocols, smart contracts, decentralized identity, and tokenized real-world assets."
    },
    {
      icon: "💳",
      title: "FinTech & E-Commerce",
      desc: "Secure micro-payments, fraud detection, algorithmic savings, and conversational commerce."
    },
    {
      icon: "🏥",
      title: "HealthTech & BioTech",
      desc: "Remote patient monitoring, diagnostic assistants, and mental wellness management systems."
    },
    {
      icon: "💡",
      title: "Open Innovation",
      desc: "Any multidisciplinary solution tackling sustainability, education, smart cities, or cyber defense."
    }
  ];

  const prizes = [
    {
      rank: "🥇 1st Place",
      title: "Grand Champion",
      reward: "₹50,000 Cash",
      perks: "Winner Trophy + Internship Fast-Track + Cloud Credits"
    },
    {
      rank: "🥈 2nd Place",
      title: "1st Runner Up",
      reward: "₹30,000 Cash",
      perks: "Runner Up Trophy + Tech Goodie Hamper + Mentorship"
    },
    {
      rank: "🥉 3rd Place",
      title: "2nd Runner Up",
      reward: "₹20,000 Cash",
      perks: "Merit Certificate + Hardware Swag Bag"
    }
  ];

  return (
    <section id="tracks" className="content-section">
      {/* Tracks Section */}
      <div className="section-header">
        <div className="section-badge">Domains</div>
        <h2 className="section-title">Hackathon <span className="gradient-text">Tracks</span></h2>
        <p className="section-subtitle">Pick a problem statement in any of our 5 official innovation domains.</p>
      </div>

      <div className="tracks-grid">
        {tracks.map((track, i) => (
          <div key={i} className="track-card">
            <span className="track-icon">{track.icon}</span>
            <h3 className="track-title">{track.title}</h3>
            <p className="track-desc">{track.desc}</p>
          </div>
        ))}
      </div>

      {/* Prizes Section */}
      <div className="prizes-wrapper">
        <div className="section-header" style={{ marginTop: '3.5rem' }}>
          <div className="section-badge">Rewards</div>
          <h2 className="section-title">Prizes & <span className="gradient-text">Perks</span></h2>
          <p className="section-subtitle">Compete for cash rewards, internships, and cloud credits.</p>
        </div>

        <div className="prizes-grid">
          {prizes.map((prize, idx) => (
            <div key={idx} className={`prize-card ${idx === 0 ? 'grand-prize' : ''}`}>
              <div className="prize-rank">{prize.rank}</div>
              <h3 className="prize-title">{prize.title}</h3>
              <div className="prize-reward">{prize.reward}</div>
              <p className="prize-perks">{prize.perks}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

