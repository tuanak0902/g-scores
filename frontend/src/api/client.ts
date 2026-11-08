const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** GET a JSON endpoint. Error messages come from the API's ProblemDetails body when present. */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError('Cannot reach the server. It may be waking up, please try again.', 0)
  }

  if (!res.ok) {
    let message = `Request failed (${res.status}).`
    try {
      const problem = await res.json()
      if (typeof problem?.detail === 'string') message = problem.detail
    } catch {
      /* body was not JSON, keep the default message */
    }
    throw new ApiError(message, res.status)
  }

  return (await res.json()) as T
}
