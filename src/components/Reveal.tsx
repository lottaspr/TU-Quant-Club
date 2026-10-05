import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/scroll'

type Props = {
  as?: ElementType
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children }: Props) {
  const [ref, inView] = useInView<HTMLElement>(0.15)
  return (
    <Tag
      ref={ref}
      data-reveal
      className={`${className} ${inView ? 'is-in' : ''}`}
      style={{ ...style, '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Headline that slides up line by line from behind a mask. */
export function Lines({
  lines,
  as: Tag = 'h2',
  className = '',
  base = 0,
}: {
  lines: string[]
  as?: ElementType
  className?: string
  base?: number
}) {
  const [ref, inView] = useInView<HTMLElement>(0.1)
  return (
    <Tag
      ref={ref}
      className={`lines ${className} ${inView ? 'is-in' : ''}`}
      style={{ '--base': `${base}ms` } as CSSProperties}
    >
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span style={{ '--i': i } as CSSProperties}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}
