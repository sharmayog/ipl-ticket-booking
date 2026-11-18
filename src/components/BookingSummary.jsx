import { formatDate, formatINR } from '../data'

export default function BookingSummary({ match, stand, qty }) {
  const price = match ? match.prices[stand] : 0
  const total = price * (Number(qty) || 0)

  return (
    <aside className="card summary" aria-live="polite">
      <h3>Booking Summary</h3>
      {!match ? (
        <p className="muted">Select a match to see your summary.</p>
      ) : (
        <dl>
          <div><dt>Match</dt><dd>{match.teams[0]} vs {match.teams[1]}</dd></div>
          <div><dt>Date &amp; Time</dt><dd>{formatDate(match.date)}</dd></div>
          <div><dt>Venue</dt><dd>{match.venue}</dd></div>
          <div><dt>Stand</dt><dd>{stand}</dd></div>
          <div><dt>Ticket Price</dt><dd>{formatINR(price)}</dd></div>
          <div><dt>Quantity</dt><dd>{qty || 0}</dd></div>
        </dl>
      )}
      <div className="total">
        <span>Total Amount</span>
        <strong>{formatINR(total)}</strong>
      </div>
    </aside>
  )
}
