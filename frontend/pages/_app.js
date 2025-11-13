import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light'
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  return <Component {...pageProps} />
}

