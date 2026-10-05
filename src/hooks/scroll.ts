import { useEffect, useRef, useState, type RefObject } from 'react'

type Listener = () => void
const listeners = new Set<Listener>()
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    listeners.forEach((fn) => fn())
  })
}

/** Runs `fn` once per animation frame while the page scrolls or resizes. */
export function useFrame(fn: Listener) {
  const saved = useRef(fn)
  saved.current = fn
  useEffect(() => {
    const run = () => saved.current()
    if (listeners.size === 0) {
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
    }
    listeners.add(run)
    run()
    return () => {
      listeners.delete(run)
      if (listeners.size === 0) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }
  }, [])
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/**
 * Progress (0..1) of an element through the viewport, written to the `--p` CSS variable.
 * - "pin": 0 when the element's top hits the viewport top, 1 when its bottom hits the viewport bottom.
 * - "leave": 0 at rest, 1 once the element has scrolled one viewport height up.
 * - "enter": 0 when the top enters the bottom of the viewport, 1 when it reaches the top.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  mode: 'pin' | 'leave' | 'enter',
  onProgress?: (p: number) => void,
) {
  useFrame(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    let p: number
    if (mode === 'pin') p = clamp(-r.top / Math.max(1, r.height - vh))
    else if (mode === 'leave') p = clamp(-r.top / vh)
    else p = clamp((vh - r.top) / vh)
    el.style.setProperty('--p', p.toFixed(4))
    onProgress?.(p)
  })
}

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
