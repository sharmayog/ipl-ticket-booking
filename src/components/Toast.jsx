export default function Toast({ toast }) {
  return (
    <div className="toast-region" aria-live="polite">
      {toast && <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.msg}</div>}
    </div>
  )
}
