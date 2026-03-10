import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import reactIcon from './assets/react.svg'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        {/* menu de cima */}
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src={reactIcon} alt="React" className="react-logo" />
            EDUARDO
          </Link>
          <ul className="nav-links">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
            <li><Link to="/services">SERVICES</Link></li>
            <li><Link to="/portfolio">PORTFOLIO</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
