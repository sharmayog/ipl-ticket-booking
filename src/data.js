// Static reference data. Matches now come from Supabase (see App.jsx).

export const TEAMS = [
  'CSK', 'MI', 'RCB', 'KKR', 'DC', 'SRH', 'RR', 'PBKS', 'GT', 'LSG',
]

export const TEAM_NAMES = {
  CSK: 'Chennai Super Kings',
  MI: 'Mumbai Indians',
  RCB: 'Royal Challengers Bengaluru',
  KKR: 'Kolkata Knight Riders',
  DC: 'Delhi Capitals',
  SRH: 'Sunrisers Hyderabad',
  RR: 'Rajasthan Royals',
  PBKS: 'Punjab Kings',
  GT: 'Gujarat Titans',
  LSG: 'Lucknow Super Giants',
}

export const VENUES = [
  'M. A. Chidambaram Stadium, Chennai',
  'Wankhede Stadium, Mumbai',
  'M. Chinnaswamy Stadium, Bengaluru',
  'Eden Gardens, Kolkata',
  'Arun Jaitley Stadium, Delhi',
  'Rajiv Gandhi Stadium, Hyderabad',
  'Narendra Modi Stadium, Ahmedabad',
  'Sawai Mansingh Stadium, Jaipur',
]

export const STANDS = ['General', 'Premium', 'VIP']

// Database row (matches table) -> object the UI uses
export const rowToMatch = (r) => ({
  id: r.id,
  teams: [r.team1, r.team2],
  date: r.match_date,
  venue: r.venue,
  prices: {
    General: r.price_general,
    Premium: r.price_premium,
    VIP: r.price_vip,
  },
  totalSeats: r.total_seats,
  availableSeats: r.available_seats,
})

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN')
