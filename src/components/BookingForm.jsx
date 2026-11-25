import { useState } from 'react'
import BookingSummary from './BookingSummary'
import { STANDS } from '../data'

const EMPTY = { name: '', email: '', phone: '', delivery: 'email', insurance: false, terms: false }
const EMPTY_SELECTION = { matchId: '', stand: 'General', qty: 1 }

export default function BookingForm({ matches, selection, setSelection, onConfirm, showToast }) {
  const [details, setDetails] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const match = matches.find((m) => m.id === Number(selection.matchId)) || null
  const maxQty = match ? Math.max(1, Math.min(6, match.availableSeats)) : 6

  const setField = (e) => {
    const { name, type, value, checked } = e.target
    setDetails((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
  }

  const changeMatch = (e) => {
    setSelection((s) => ({ ...s, matchId: e.target.value }))
    const m = matches.find((x) => x.id === Number(e.target.value))
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

  const submit = async (e) => {
    e.preventDefault() // browser HTML5 validation has already passed at this point
    if (!match || saving) return
    setSaving(true)
    const qty = Number(selection.qty)
    const ok = await onConfirm({
      matchId: match.id,
      ref: 'IPL' + Math.floor(100000 + Math.random() * 900000),
      match: `${match.teams[0]} vs ${match.teams[1]}`,
      venue: match.venue,
      date: match.date,
      stand: selection.stand,
      qty,
      total: match.prices[selection.stand] * qty,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone,
    })
    setSaving(false)
    if (ok) {
      // only clear the form when the booking really saved
      setDetails(EMPTY)
      setSelection(EMPTY_SELECTION)
    }
  }

  const reset = () => {
    setDetails(EMPTY)
    setSelection(EMPTY_SELECTION)
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
                {matches.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.availableSeats <= 0}>
                    #{m.id} {m.teams[0]} vs {m.teams[1]}
                    {m.availableSeats <= 0 ? ' (Sold out)' : ` (${m.availableSeats} seats left)`}
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
              Number of Tickets (1–{maxQty})
              <input
                type="number"
                name="qty"
                required
                min="1"
                max={maxQty}
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
            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button type="reset" className="btn btn-outline-dark">Reset</button>
          </div>
        </form>

        <BookingSummary match={match} stand={selection.stand} qty={selection.qty} />
      </div>
    </section>
  )
}
