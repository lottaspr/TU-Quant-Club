export const CLUB = 'TU Quant Club'
export const TAGLINE = 'Quantitative Trading Club · Munich'
export const COHORT = 'Cohort 07'
export const EMAIL = 'hello@quantum-club.de'
// TODO: replace with the real application form link
export const APPLY_URL = '#/apply'
export const LINKEDIN_URL = 'https://www.linkedin.com/'
export const INSTAGRAM_URL = 'https://www.instagram.com/'

export const STATS = [
  { value: 2019, label: 'Founded', plain: true },
  { value: 40, suffix: '+', label: 'Active members' },
  { value: 3, label: 'Industry partners' },
  { value: 7, pad: 2, label: 'Cohorts run' },
]

export const EVENTS = [
  {
    day: 'Oct 14',
    weekday: 'Wednesday · 19:00',
    type: 'Social',
    title: 'Kickoff Mixer',
    text: 'Meet the board and this semester’s new members over drinks and pizza.',
  },
  {
    day: 'Oct 21',
    weekday: 'Wednesday',
    type: 'Workshop',
    title: 'Intro to Python for Quant Finance',
    text: 'A hands-on workshop for members with no coding background. Limited seats.',
  },
  {
    day: 'Nov 08',
    weekday: 'Sunday',
    type: 'Competition',
    title: 'Case Competition',
    text: 'Teams compete on a live portfolio-construction case, judged by alumni.',
  },
  {
    day: 'Nov 29',
    weekday: 'Sunday · Frankfurt',
    type: 'Industry',
    title: 'Industry Night',
    text: 'Talks and Q&A with analysts from our partner firms in Frankfurt.',
  },
]

export const TEAM = [
  { role: 'President', c: '#2e5ae4' },
  { role: 'VP Research', c: '#1f9e89' },
  { role: 'VP Events', c: '#442572' },
  { role: 'Head of Partnerships', c: '#35b779' },
  { role: 'Treasurer', c: '#2e48c8' },
  { role: 'Workshops Lead', c: '#6dcd59' },
  { role: 'Research Lead', c: '#31688e' },
  { role: 'Social Lead', c: '#fde725' },
]

export const VIRIDIS = [
  '#440154', '#482878', '#3e4a89', '#31688e', '#26828e',
  '#1f9e89', '#35b779', '#6dcd59', '#b4de2c', '#fde725',
]

export function viridis(t: number) {
  const i = Math.round(Math.min(1, Math.max(0, t)) * (VIRIDIS.length - 1))
  return VIRIDIS[i]
}
