import { formatDate, formatINR, STANDS } from '../data'

export default function MatchCard({ match, onBook, selected }) {
  const [a, b] = match.teams
  return (
    <article className={`match-card ${selected ? 'selected' : ''}`}>
      <div className="match-top">
        <span className="match-no">Match #{match.id}</span>
        <span className="match-date">{formatDate(match.date)}</span>
      </div>
      <h3 className="match-teams">
        <span>{a}</span> <em>vs</em> <span>{b}</span>
      </h3>
      <p className="match-venue">📍 {match.venue}</p>
      <ul className="price-row">
        {STANDS.map((s) => (
          <li key={s}>
            <small>{s}</small>
            <strong>{formatINR(match.prices[s])}</strong>
          </li>
        ))}
      </ul>
      <button className="btn btn-gold btn-block" onClick={() => onBook(match)}>
        Book
      </button>
    </article>
  )
}
