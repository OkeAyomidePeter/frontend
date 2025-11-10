import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { Footer } from "./footer"

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

