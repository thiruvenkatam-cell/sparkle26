import { Link } from 'react-router-dom'
import { Instagram, Mail } from 'lucide-react'
import '../styles/fooder.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Link className="footer-logo" to="/" aria-label="SPARKLE'26 home">
          <img src="/sparkle-logo.png" alt="SPARKLE'26 - Ideas Ignite Tomorrow" />
        </Link>
        <p>Ideas ignite tomorrow. Meet the makers, thinkers, and future innovators.</p>
        <div className="socials">
          <a href="https://www.instagram.com/mgr_it_department?xtok=OWwyaHlneHhvaXN3" aria-label="Instagram">
            <Instagram />
          </a>
          <a href="mailto:events@example.com" aria-label="Email">
            <Mail />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SPARKLE'26. All rights reserved.</span>
        <span>Built for ideas that move the future.</span>
      </div>
    </footer>
  )
}