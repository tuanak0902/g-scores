// Shapes returned by the .NET API (System.Text.Json uses camelCase).

export interface Student {
  sbd: string
  math: number | null
  literature: number | null
  foreignLanguage: number | null
  physics: number | null
  chemistry: number | null
  biology: number | null
  history: number | null
  geography: number | null
  civicEducation: number | null
  foreignLanguageCode: string | null
}

export interface SubjectDistribution {
  code: string
  name: string
  excellent: number
  good: number
  average: number
  poor: number
}

export interface TopStudent {
  sbd: string
  math: number
  physics: number
  chemistry: number
  total: number
}
