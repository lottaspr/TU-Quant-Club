import { useRef, useState } from 'react'
import type { PointerEvent as RPointerEvent, ReactNode } from 'react'

type Axis = 'X' | 'Y'
type Edge = 'left' | 'right' | 'top' | 'bottom'

/** Which edge of the element the pointer is closest to. */
function edgeOf(el: HTMLElement, e: RPointerEvent) {
  const r = el.getBoundingClientRect()
  const d: Record<Edge, number> = {
    left: (e.clientX - r.left) / r.width,
    right: (r.right - e.clientX) / r.width,
    top: (e.clientY - r.top) / r.height,
    bottom: (r.bottom - e.clientY) / r.height,
  }
  return (Object.keys(d) as Edge[]).reduce((a, b) => (d[b] < d[a] ? b : a))
}

// Angle that pushes the given edge away from the viewer.
const PUSH: Record<Edge, [Axis, number]> = {
  left: ['Y', -180],
  right: ['Y', 180],
  top: ['X', 180],
  bottom: ['X', -180],
}

/**
 * Card that flips over towards the side the pointer comes in from, and flips
 * back out through the side it leaves by. Tap toggles it on touch screens.
 */
export function FlipCard({ front, back, label }: { front: ReactNode; back: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [axis, setAxis] = useState<Axis>('Y')
  const [angle, setAngle] = useState(0)
  const [animate, setAnimate] = useState(true)
  const flipped = angle % 360 !== 0

  const enter = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const [ax, a] = PUSH[edgeOf(ref.current, e)]
    setAnimate(true)
    setAxis(ax)
    // If a flip-out is still spinning on this axis, carry on from where it is.
    setAngle((ax === axis ? angle : 0) + a)
  }

  const leave = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current || !flipped) return
    const [ax, a] = PUSH[edgeOf(ref.current, e)]
    setAnimate(true)
    // Leaving along the same axis keeps spinning the way the pointer moves; otherwise flip straight back.
    setAngle(ax === axis ? angle - a : 0)
  }

  const tap = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    setAnimate(true)
    setAxis('Y')
    setAngle(flipped ? 0 : 180)
  }

  // Snap a full turn back to 0 without animating, so the next flip starts clean.
  const settle = () => {
    if (angle !== 0 && !flipped) {
      setAnimate(false)
      setAngle(0)
    }
  }

  return (
    <div
      ref={ref}
      className="flip"
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerUp={tap}
      role="group"
      aria-label={label}
    >
      <div
        className={`flip__inner ${animate ? '' : 'flip__inner--snap'} ${flipped ? 'is-flipped' : ''}`}
        style={{ transform: `rotate${axis}(${angle}deg)` }}
        onTransitionEnd={settle}
      >
        <div className="flip__face flip__face--front" aria-hidden={flipped}>
          {front}
        </div>
        <div className={`flip__face flip__face--back flip__face--${axis}`} aria-hidden={!flipped}>
          {back}
        </div>
      </div>
    </div>
  )
}
