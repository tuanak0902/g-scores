interface Props {
  rows?: number
  height?: number
}

/** Placeholder blocks shown while data loads. */
export default function Skeleton({ rows = 1, height = 20 }: Props) {
  return (
    <div className="skeleton-stack" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  )
}
