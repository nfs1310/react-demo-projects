import { Link } from "react-router-dom"


const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-brand">
            <Link to={'/'}>Movie App</Link>
        </div>
        <div className="navbar-links">
            <Link className="nav-link" to={'/'}>Movies</Link>
            <Link className="nav-link" to={'/favorites'}>Favorites</Link>
        </div>
    </nav>
  )
}

export default Navbar