import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function HomeNavbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#090D14]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-2xl text-white"
        >
           <img src="/logo.svg" alt="SkillSync" className="w-8 h-8 shrink-0" />
           {/* <span className="whitespace-nowrap"></span> */}
          Skill<span className="text-signature">Sync</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">

          {/* Home */}
          <Link
            to="/"
            className="text-slate-300 hover:text-[#00E5C7] transition-colors duration-300"
          >
            Home
          </Link>

          {/* Features */}
          <a
            href="#features"
            className="text-slate-300 hover:text-[#00E5C7] transition-colors duration-300"
          >
            Features
          </a>

          {/* How it Works */}
          <a
            href="#how-it-works"
            className="text-slate-300 hover:text-[#00E5C7] transition-colors duration-300"
          >
            How it Works
          </a>

          <span className="w-px h-5 bg-zinc-700"></span>

          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-[#00E5C7] transition-colors duration-300"
              >
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="text-zinc-300 hover:text-white transition-colors duration-300"
              >
                Hi, {user.name}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="border border-zinc-700 text-slate-300 hover:border-[#00E5C7] hover:text-[#00E5C7] px-4 py-2 rounded-lg transition-all duration-300"
              >
                Log In
              </Link>

              {/* Get Started */}
              <Link
                to="/register"
                className="bg-signature text-black font-semibold px-5 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden ml-auto text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#090D14]">
          <div className="flex flex-col px-6 py-5 gap-5">

            {/* Home */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-[#00E5C7] transition-colors"
            >
              Home
            </Link>

            {/* Features */}
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-[#00E5C7] transition-colors"
            >
              Features
            </a>

            {/* How it Works */}
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-[#00E5C7] transition-colors"
            >
              How it Works
            </a>

            {user ? (
              <>
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-[#00E5C7] transition-colors"
                >
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-[#00E5C7] transition-colors"
                >
                  Profile
                </Link>

                <hr className="border-zinc-800" />

                <div className="text-slate-400 text-sm">
                  Signed in as
                </div>

                <div className="text-white font-semibold">
                  {user.name}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-3 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="border border-zinc-700 text-slate-300 hover:border-[#00E5C7] hover:text-[#00E5C7] text-center px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Log In
                </Link>

                {/* Get Started */}
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-signature text-black text-center font-semibold rounded-lg py-2 hover:scale-[1.02] transition-transform duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}