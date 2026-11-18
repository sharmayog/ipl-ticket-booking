export default function Hero({ onSchedule, onBook }) {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow">TATA IPL 2026</p>
        <h1>Experience The Stadium Energy Live!</h1>
        <p className="hero-sub">
          Pick your match, choose your stand and lock in your seats in under a minute.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={onSchedule}>View Schedule</button>
          <button className="btn btn-outline" onClick={onBook}>Book Ticket</button>
        </div>
      </div>
    </section>
  )
}
