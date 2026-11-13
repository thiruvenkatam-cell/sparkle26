import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Loader from './components/Loader'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import Event from './components/Event'
import Registration from './components/Registration'
import TicketPage from './components/TicketPage'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import EventDetails from './components/EventDetails'
import Coordinators from './components/Coordinators'

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])
  if (loading) return <Loader />
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Event />} />
          <Route path="/coordinators" element={<Coordinators />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/ticket/:ticketCode" element={<TicketPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/events/details/:eventId" element={<EventDetails />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
