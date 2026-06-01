import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes/router'
import { setUnauthorizedHandler } from '@/lib/api/client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  useEffect(() => {
    setUnauthorizedHandler(() => {
      const here = window.location.pathname
      if (here !== '/login') {
        window.location.href = `/login?from=${encodeURIComponent(here)}`
      }
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
