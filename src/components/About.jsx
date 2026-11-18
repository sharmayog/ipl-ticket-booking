import { TEAMS, TEAM_NAMES, VENUES } from '../data'

export default function About() {
  return (
    <section className="section" id="about">
      <h2>About IPL 2026</h2>
      <p className="lead">
        The Indian Premier League brings together ten franchises for weeks of
        high-voltage T20 cricket across the country's biggest stadiums.
      </p>
      <div className="two-col">
        <div className="card">
          <h3>Popular Teams</h3>
          <ul className="plain-list">
            {TEAMS.map((t) => (
              <li key={t}><strong>{t}</strong> – {TEAM_NAMES[t]}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Major Match Venues</h3>
          <ul className="plain-list">
            {VENUES.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
