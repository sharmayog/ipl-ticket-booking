import { useState } from 'react'
import MatchCard from './MatchCard'
import { TEAMS, formatDate, formatINR } from '../data'

export default function Schedule({ matches, loading, onBook, selectedId, showToast }) {
  const [team, setTeam] = useState('All')
  const [view, setView] = useState('grid') // grid | list | table

  const filtered =
    team === 'All' ? matches : matches.filter((m) => m.teams.includes(team))

  const changeTeam = (value) => {
    setTeam(value)
    showToast(value === 'All' ? 'Showing all matches' : `Showing ${value} matches`, 'info')
  }

  return (
    <section className="section" id="matches">
      <h2>
        Match Schedule <span className="live-pill">● Live seats</span>
      </h2>

      <div className="toolbar">
        <label className="field-inline">
          <span>Filter by team</span>
          <select value={team} onChange={(e) => changeTeam(e.target.value)}>
            <option value="All">All Teams</option>
            {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <div className="view-toggle" role="group" aria-label="Change view">
          {['grid', 'list', 'table'].map((v) => (
            <button
              key={v}
              className={view === v ? 'active' : ''}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="empty">Loading matches...</p>}
      {!loading && filtered.length === 0 && (
        <p className="empty">No matches found. Did you run the SQL setup in Supabase?</p>
      )}

      {view !== 'table' && (
        <div className={`match-grid ${view === 'list' ? 'as-list' : ''}`}>
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} onBook={onBook} selected={m.id === selectedId} />
          ))}
        </div>
      )}

      {view === 'table' && filtered.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Match No.</th>
                <th>Teams</th>
                <th>Date &amp; Time</th>
                <th>Venue</th>
                <th>General</th>
                <th>Premium</th>
                <th>VIP</th>
                <th>Seats Left</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td><strong>{m.teams[0]} vs {m.teams[1]}</strong></td>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.venue}</td>
                  <td>{formatINR(m.prices.General)}</td>
                  <td>{formatINR(m.prices.Premium)}</td>
                  <td>{formatINR(m.prices.VIP)}</td>
                  <td>{m.availableSeats <= 0 ? 'Sold out' : m.availableSeats}</td>
                  <td>
                    <button
                      className="btn btn-gold btn-sm"
                      disabled={m.availableSeats <= 0}
                      onClick={() => onBook(m)}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
