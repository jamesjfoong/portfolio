'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import queryString from 'query-string'

const getCurrentHash = () =>
  typeof window !== 'undefined' ? window.location.hash.replace(/^#!?/, '') : ''

export const useHashState = () => {
  const router = useRouter()
  const params = useParams()
  const [hash, _setHash] = useState<string>(getCurrentHash())

  const setHash = (newHash: string) => {
    let updatedUrl = window.location.href
    updatedUrl = queryString.stringifyUrl({
      url: updatedUrl.split('#')[0],
      fragmentIdentifier: newHash,
    })

    _setHash(newHash)
    router.replace(updatedUrl)
  }
  useEffect(() => {
    const currentHash = getCurrentHash()
    _setHash(currentHash)
  }, [params])

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = getCurrentHash()
      _setHash(currentHash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return [hash, setHash] as const
}
