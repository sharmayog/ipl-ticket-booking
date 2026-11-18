// Sample data for the project. Dates, venues and prices are illustrative.

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

export const MATCHES = [
  { id: 1, teams: ['CSK', 'MI'], date: '2026-03-28T19:30:00', venue: VENUES[0], prices: { General: 1500, Premium: 3500, VIP: 8000 } },
  { id: 2, teams: ['RCB', 'KKR'], date: '2026-03-30T19:30:00', venue: VENUES[2], prices: { General: 1800, Premium: 4000, VIP: 9000 } },
  { id: 3, teams: ['DC', 'SRH'], date: '2026-04-02T19:30:00', venue: VENUES[4], prices: { General: 1200, Premium: 3000, VIP: 7000 } },
  { id: 4, teams: ['GT', 'RR'], date: '2026-04-04T15:30:00', venue: VENUES[6], prices: { General: 1300, Premium: 3200, VIP: 7500 } },
  { id: 5, teams: ['MI', 'RCB'], date: '2026-04-06T19:30:00', venue: VENUES[1], prices: { General: 2000, Premium: 4500, VIP: 10000 } },
  { id: 6, teams: ['KKR', 'CSK'], date: '2026-04-09T19:30:00', venue: VENUES[3], prices: { General: 1600, Premium: 3800, VIP: 8500 } },
  { id: 7, teams: ['SRH', 'PBKS'], date: '2026-04-11T15:30:00', venue: VENUES[5], prices: { General: 1100, Premium: 2800, VIP: 6500 } },
  { id: 8, teams: ['RR', 'LSG'], date: '2026-04-13T19:30:00', venue: VENUES[7], prices: { General: 1200, Premium: 3000, VIP: 7000 } },
]

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN')
