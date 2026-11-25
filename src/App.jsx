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

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// database row -> object the UI uses
const fromRow = (r) => ({
  id: r.id,
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
  const [bookings, setBookings] = useState([])

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // Load bookings from Supabase on page load
  useEffect(() => {
    supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) showToast('Could not load bookings: ' + error.message, 'info')
        else setBookings(data.map(fromRow))
      })
  }, [showToast])

  const handleBook = (match) => {
    setSelection((s) => ({ ...s, matchId: match.id }))
    scrollToId('book')
    showToast(`Selected ${match.teams[0]} vs ${match.teams[1]} - fill in your details`)
  }

  // PUSH a new booking to Supabase
  const confirmBooking = async (b) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
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
      showToast('Could not save booking: ' + error.message, 'info')
      return
    }
    setBookings((prev) => [fromRow(data), ...prev])
    showToast(`Booking confirmed! ID: ${b.ref}`)
    setTimeout(() => scrollToId('bookings'), 400)
  }

  // DELETE a booking from Supabase
  const cancelBooking = async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id)
    if (error) {
      showToast('Could not cancel: ' + error.message, 'info')
      return
    }
    setBookings((prev) => prev.filter((x) => x.id !== id))
    showToast('Booking cancelled', 'info')
  }

  return (
    <>
      <Navbar bookingCount={bookings.length} />
      <Hero onSchedule={() => scrollToId('matches')} onBook={() => scrollToId('book')} />
      <main>
        <About />
        <Schedule
          onBook={handleBook}
          selectedId={Number(selection.matchId) || null}
          showToast={showToast}
        />
        <BookingForm
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
