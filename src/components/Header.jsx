import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Users } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Events', '/events'],
    ['Coordinators', '/coordinators'],
    ['Registration', '/register'],
    ['Gallery', '/gallery'],
    ['Contact', '/contact'],
  ]
  return (
    <header className="site-header">
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        {links.map(([label, path]) => (
          <NavLink key={path} to={path} end={path === '/'}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Link className="btn btn-small header-login" to="/register">
        <Users size={15} /> Register
      </Link>
    </header>
  )
}
