export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="14.5" r="10.5" fill="none" stroke="#fff" strokeWidth="3.6" />
      <path
        d="M5 27c4.5-1 6.5-10 11-10s6.5 9 11 10"
        fill="none"
        stroke="#2e5ae4"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
