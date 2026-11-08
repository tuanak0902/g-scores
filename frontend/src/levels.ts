// One place for the 4 report levels (must match ScoreThresholds in the API).
// `color` fills bars and chart series; `text` and `tint` are for small labels
// so they keep enough contrast on a light background.
// Names and ranges are looked up at render time via the i18n hook — see useLevels().

import { useTranslation } from 'react-i18next'

export const LEVEL_KEYS = ['excellent', 'good', 'average', 'poor'] as const
export type LevelKey = (typeof LEVEL_KEYS)[number]

export const LEVEL_STYLES: Record<
  LevelKey,
  { color: string; text: string; tint: string }
> = {
  excellent: { color: '#12805c', text: '#0c6b4a', tint: '#e2f3ec' },
  good:      { color: '#3b6fd8', text: '#1f4fb5', tint: '#e4ecfb' },
  average:   { color: '#e3a008', text: '#8a5d00', tint: '#fcf0cc' },
  poor:      { color: '#d64545', text: '#a82828', tint: '#fbe6e6' },
}

export interface Level {
  key: LevelKey
  name: string
  range: string
  color: string
  text: string
  tint: string
}

/** Returns the full level list with translated names and ranges. */
export function useLevels(): Level[] {
  const { t } = useTranslation()
  return LEVEL_KEYS.map((key) => ({
    key,
    name: t(`levels.${key}`),
    range: t(`levels.ranges.${key}`),
    ...LEVEL_STYLES[key],
  }))
}

/** Returns the level for a given score (uses translated names via the hook). */
export function levelOf(score: number): Level & { name: string; range: string; color: string; text: string; tint: string } {
  // Fallback static names for non-hook contexts (e.g. SSR, tests)
  const key: LevelKey = score >= 8 ? 'excellent' : score >= 6 ? 'good' : score >= 4 ? 'average' : 'poor'
  return { key, name: key, range: '', ...LEVEL_STYLES[key] }
}

/** Hook-aware version — use this inside React components for translated level names. */
export function useLevelOf(score: number): Level {
  const levels = useLevels()
  if (score >= 8) return levels[0]
  if (score >= 6) return levels[1]
  if (score >= 4) return levels[2]
  return levels[3]
}
