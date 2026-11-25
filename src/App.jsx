import { useState, useEffect, useCallback, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Schedule from './components/Schedule'
import BookingForm from './components/BookingForm'
import MyBookings from './components/MyBookings'
import Guidelines from './components/Guidelines'
import Footer from './components/Footer'
import Toast from './components/Toast'
import { supabase } from './supabase'
import { rowToMatch } from './data'

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// bookings table row -> object the UI uses
const fromRow = (r) => ({
  id: r.id,
  matchId: r.match_id,
  ref: r.ref,
  match: r.match,
  venue: r.venue,
  date: r.match_date,
  stand: r.stand,
  qty: r.qty,
  total: r.total,
  name: r.name,
  email: r.email,
  phone: r.phone,
})

export default function App() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const [selection, setSelection] = useState({ matchId: '', stand: 'General', qty: 1 })
  const [matches, setMatches] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // small helpers that keep state in sync (safe to call twice with the same row)
  const upsertMatch = useCallback((row) => {
    const m = rowToMatch(row)
    setMatches((prev) =>
      prev.some((x) => x.id === m.id)
        ? prev.map((x) => (x.id === m.id ? m : x))
        : [...prev, m].sort((a, b) => a.id - b.id)
    )
  }, [])

  const upsertBooking = useCallback((row) => {
    const b = fromRow(row)
    setBookings((prev) =>
      prev.some((x) => x.id === b.id) ? prev.map((x) => (x.id === b.id ? b : x)) : [b, ...prev]
    )
  }, [])

  // 3. FETCH matches + bookings from Supabase on page load
  useEffect(() => {
    let active = true
    const load = async () => {
      const [m, b] = await Promise.all([
        supabase.from('matches').select('*').order('id', { ascending: true }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      ])
      if (!active) return
      if (m.error) showToast('Could not load matches: ' + m.error.message, 'info')
      else setMatches(m.data.map(rowToMatch))
      if (b.error) showToast('Could not load bookings: ' + b.error.message, 'info')
      else setBookings(b.data.map(fromRow))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [showToast])

  // 5. REALTIME: update the UI whenever the database changes
  useEffect(() => {
    const channel = supabase
      .channel('ipl-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, (p) => {
        if (p.eventType === 'DELETE') setMatches((prev) => prev.filter((m) => m.id !== p.old.id))
        else upsertMatch(p.new)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (p) => {
        if (p.eventType === 'DELETE') setBookings((prev) => prev.filter((b) => b.id !== p.old.id))
        else upsertBooking(p.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [upsertMatch, upsertBooking])

  // 4a. Change available_seats using .update().eq()
  // Reads the latest value, then updates only if nobody else changed it meanwhile.
  const adjustSeats = async (matchId, delta) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: cur, error } = await supabase
        .from('matches')
        .select('available_seats, total_seats')
        .eq('id', matchId)
        .single()
      if (error) return { error }

      const next = Math.min(cur.available_seats + delta, cur.total_seats)
      if (next < 0) return { error: { message: `Only ${cur.available_seats} seats left` } }

      const { data, error: upErr } = await supabase
        .from('matches')
        .update({ available_seats: next })
        .eq('id', matchId)
        .eq('available_seats', cur.available_seats) // guard against two people booking at once
        .select()
      if (upErr) return { error: upErr }
      if (data && data.length > 0) {
        upsertMatch(data[0])
        return { ok: true }
      }
    }
    return { error: { message: 'Seats changed while booking, please try again' } }
  }

  const handleBook = (match) => {
    setSelection((s) => ({ ...s, matchId: match.id }))
    scrollToId('book')
    showToast(`Selected ${match.teams[0]} vs ${match.teams[1]} - fill in your details`)
  }

  // 4b. BOOK: reserve seats (.update) then save the booking (.insert)
  const confirmBooking = async (b) => {
    const seat = await adjustSeats(b.matchId, -b.qty)
    if (seat.error) {
      showToast('Could not book: ' + seat.error.message, 'info')
      return false
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        match_id: b.matchId,
        ref: b.ref,
        match: b.match,
        venue: b.venue,
        match_date: b.date,
        stand: b.stand,
        qty: b.qty,
        total: b.total,
        name: b.name,
        email: b.email,
        phone: b.phone,
      })
      .select()
      .single()

    if (error) {
      await adjustSeats(b.matchId, b.qty) // give the seats back
      showToast('Could not save booking: ' + error.message, 'info')
      return false
    }

    upsertBooking(data)
    showToast(`Booking confirmed! ID: ${b.ref}`)
    setTimeout(() => scrollToId('bookings'), 400)
    return true
  }

  // CANCEL: delete the booking and release its seats
  const cancelBooking = async (id) => {
    const booking = bookings.find((x) => x.id === id)
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) {
      showToast('Could not cancel: ' + error.message, 'info')
      return
    }
    setBookings((prev) => prev.filter((x) => x.id !== id))
    if (booking?.matchId) await adjustSeats(booking.matchId, booking.qty)
    showToast('Booking cancelled - seats released', 'info')
  }

  return (
    <>
      <Navbar bookingCount={bookings.length} />
      <Hero onSchedule={() => scrollToId('matches')} onBook={() => scrollToId('book')} />
      <main>
        <About />
        <Schedule
          matches={matches}
          loading={loading}
          onBook={handleBook}
          selectedId={Number(selection.matchId) || null}
          showToast={showToast}
        />
        <BookingForm
          matches={matches}
          selection={selection}
          setSelection={setSelection}
          onConfirm={confirmBooking}
          showToast={showToast}
        />
        <MyBookings bookings={bookings} onCancel={cancelBooking} />
        <Guidelines />
      </main>
      <Footer />
      <Toast toast={toast} />
    </>
  )
}
