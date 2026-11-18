import { formatDate, formatINR } from '../data'

export default function MyBookings({ bookings, onCancel }) {
  return (
    <section className="section" id="bookings">
      <h2>My Ticket Bookings</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Match</th>
              <th>Date &amp; Time</th>
              <th>Stand</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">No bookings yet. Your tickets will appear here.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.ref}</strong></td>
                  <td>{b.match}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{b.stand}</td>
                  <td>{b.qty}</td>
                  <td>{formatINR(b.total)}</td>
                  <td>{b.name}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => onCancel(b.id)}>Cancel</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
