import { useState } from 'react'
import BookingSummary from './BookingSummary'
import { MATCHES, STANDS } from '../data'

const EMPTY = { name: '', email: '', phone: '', delivery: 'email', insurance: false, terms: false }

export default function BookingForm({ selection, setSelection, onConfirm, showToast }) {
  const [details, setDetails] = useState(EMPTY)

  const match = MATCHES.find((m) => m.id === Number(selection.matchId)) || null

  const setField = (e) => {
    const { name, type, value, checked } = e.target
    setDetails((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
  }

  const changeMatch = (e) => {
    setSelection((s) => ({ ...s, matchId: e.target.value }))
    const m = MATCHES.find((x) => x.id === Number(e.target.value))
    if (m) showToast(`Summary updated: ${m.teams[0]} vs ${m.teams[1]}`, 'info')
  }

  const changeStand = (e) => {
    setSelection((s) => ({ ...s, stand: e.target.value }))
    showToast(`Stand changed to ${e.target.value}`, 'info')
  }

  const changeQty = (e) => {
    setSelection((s) => ({ ...s, qty: e.target.value }))
    if (e.target.value !== '') showToast('Quantity updated', 'info')
  }

  const submit = (e) => {
    e.preventDefault() // browser HTML5 validation has already passed at this point
    const price = match.prices[selection.stand]
    onConfirm({
      id: Date.now(),
      ref: 'IPL' + Math.floor(100000 + Math.random() * 900000),
      match: `${match.teams[0]} vs ${match.teams[1]}`,
      venue: match.venue,
      date: match.date,
      stand: selection.stand,
      qty: Number(selection.qty),
      total: price * Number(selection.qty),
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone,
    })
    setDetails(EMPTY)
    setSelection({ matchId: '', stand: 'General', qty: 1 })
  }

  const reset = () => {
    setDetails(EMPTY)
    setSelection({ matchId: '', stand: 'General', qty: 1 })
    showToast('Form reset', 'info')
  }

  return (
    <section className="section" id="book">
      <h2>Book Your Tickets</h2>
      <div className="booking-layout">
        <form className="card form" onSubmit={submit} onReset={reset}>
          <div className="form-grid">
            <label className="full">
              Match
              <select name="match" required value={selection.matchId} onChange={changeMatch}>
                <option value="" disabled>Select a match</option>
                {MATCHES.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.id} {m.teams[0]} vs {m.teams[1]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Stand Category
              <select name="stand" required value={selection.stand} onChange={changeStand}>
                {STANDS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label>
              Number of Tickets (1–6)
              <input
                type="number"
                name="qty"
                required
                min="1"
                max="6"
                value={selection.qty}
                onChange={changeQty}
              />
            </label>

            <label>
              Full Name
              <input
                type="text"
                name="name"
                required
                minLength="3"
                maxLength="40"
                placeholder="e.g. Yogesh Sharma"
                value={details.name}
                onChange={setField}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={details.email}
                onChange={setField}
              />
            </label>

            <label className="full">
              Phone Number
              <input
                type="tel"
                name="phone"
                required
                pattern="[6-9][0-9]{9}"
                minLength="10"
                maxLength="10"
                inputMode="numeric"
                title="Enter a valid 10-digit Indian mobile number"
                placeholder="10-digit mobile number"
                value={details.phone}
                onChange={setField}
              />
            </label>

            <fieldset className="full">
              <legend>Ticket Delivery</legend>
              <label className="check">
                <input type="radio" name="delivery" value="email"
                  checked={details.delivery === 'email'} onChange={setField} />
                E-ticket via Email
              </label>
              <label className="check">
                <input type="radio" name="delivery" value="sms"
                  checked={details.delivery === 'sms'} onChange={setField} />
                E-ticket via SMS
              </label>
            </fieldset>

            <label className="check full">
              <input type="checkbox" name="insurance" checked={details.insurance} onChange={setField} />
              Send me match-day updates and reminders
            </label>

            <label className="check full">
              <input type="checkbox" name="terms" required checked={details.terms} onChange={setField} />
              I have read and agree to the ticket guidelines
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-gold">Confirm Booking</button>
            <button type="reset" className="btn btn-outline-dark">Reset</button>
          </div>
        </form>

        <BookingSummary match={match} stand={selection.stand} qty={selection.qty} />
      </div>
    </section>
  )
}
