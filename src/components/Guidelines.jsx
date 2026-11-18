const CARDS = [
  {
    icon: '✅',
    title: 'Ticket Verification',
    text: 'Show the QR code on your e-ticket at the gate. Each QR code is valid for a single entry and is checked at the turnstile.',
  },
  {
    icon: '🪪',
    title: 'ID Proof Requirement',
    text: 'Carry a valid government photo ID (Aadhaar, passport, driving licence or voter ID) matching the name on the booking.',
  },
  {
    icon: '🚫',
    title: 'Prohibited Items',
    text: 'Outside food and drinks, sharp objects, lighters, banners with political content, large bags and professional cameras are not allowed.',
  },
]

export default function Guidelines() {
  return (
    <section className="section" id="guidelines">
      <h2>Guidelines</h2>
      <div className="guide-grid">
        {CARDS.map((c) => (
          <article className="card guide-card" key={c.title}>
            <div className="guide-icon" aria-hidden="true">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
