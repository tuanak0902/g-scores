import { useCallback, useEffect, useState } from 'react'
import { ApiError, apiGet } from '../api/client'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

const idle = { data: null, loading: false, error: null }

/**
 * Fetches `path` and returns { data, loading, error, reload }.
 * Pass null to stay idle (used by the search form until a number is submitted).
 * Stale requests are cancelled when the path changes or the component unmounts.
 */
export function useFetch<T>(path: string | null) {
  const [state, setState] = useState<FetchState<T>>(idle)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!path) {
      setState(idle)
      return
    }

    const controller = new AbortController()
    setState((s) => ({ data: s.data, loading: true, error: null }))

    apiGet<T>(path, controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const error = err instanceof ApiError ? err : new ApiError('Something went wrong.', 0)
        setState({ data: null, loading: false, error })
      })

    return () => controller.abort()
  }, [path, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, reload }
}
