import { Outlet } from 'react-router-dom'
import { NavBar } from './nav-bar'
import { SectionSubNav } from './section-sub-nav'

export function AppShell() {
  return (
    <div className="min-h-svh flex flex-col">
      <NavBar />
      <SectionSubNav />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
