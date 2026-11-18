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

const STORAGE_KEY = 'ipl-bookings'

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function App() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const [selection, setSelection] = useState({ matchId: '', stand: 'General', qty: 1 })

  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    } catch {
      /* storage unavailable - ignore */
    }
  }, [bookings])

  // Reusable notification
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const handleBook = (match) => {
    setSelection((s) => ({ ...s, matchId: match.id }))
    scrollToId('book')
    showToast(`Selected ${match.teams[0]} vs ${match.teams[1]} - fill in your details`)
  }

  const confirmBooking = (booking) => {
    setBookings((b) => [booking, ...b])
    showToast(`Booking confirmed! ID: ${booking.ref}`)
    setTimeout(() => scrollToId('bookings'), 400)
  }

  const cancelBooking = (id) => {
    setBookings((b) => b.filter((x) => x.id !== id))
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
