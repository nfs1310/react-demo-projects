import { Link, useLocation } from "react-router"


const Navbar = () => {
    const locstion = useLocation();
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link">
                    🎵 Music Player
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className={`nav-link ${locstion.pathname === "/" ? "active" : ""}`}>
                    All Songs
                </Link>
                <Link to="/playlists" className={`nav-link ${locstion.pathname === "/playlists" ? "active" : ""}`}>
                    Playlists
                </Link>
            </div>
        </nav>
    )
}

export default Navbar