import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import * as notificationService from "../services/notificationService";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      await notificationService.markAsRead();
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const navLink = ({ isActive }) =>
    `transition-colors ${isActive
      ? "text-[#00E5C7]"
      : "text-slate-300 hover:text-[#00E5C7]"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#090D14] border-b border-zinc-800">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-2xl font-bold text-white shrink-0"
        >
           <img src="/logo.svg" alt="SkillSync" className="w-8 h-8 shrink-0" />
           <span className="whitespace-nowrap">
             Skill<span className="text-[#00E5C7]">Sync</span>
           </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">

          <NavLink to="/dashboard" className={navLink}>
            Dashboard
          </NavLink>

          <NavLink to="/create-project" className={navLink}>
            New Project
          </NavLink>

          <NavLink to="/projects" className={navLink}>
            Discover
          </NavLink>

          <NavLink to="/my-projects" className={navLink}>
            My Projects
          </NavLink>

          <NavLink to="/profile" className={navLink}>
            Profile
          </NavLink>

          <span className="text-zinc-600">|</span>

          <span className="text-slate-300 font-medium">
            {user?.name}
          </span>

          <div className="relative" ref={dropdownRef}>
            <button onClick={handleBellClick} className="relative text-zinc-300 hover:text-white transition">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-zinc-500 text-sm p-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="px-4 py-3 border-b border-zinc-800 last:border-0 text-sm text-zinc-200"
                    >
                      {n.message}
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-zinc-800 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

        {/* Mobile Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
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

          <div className="flex flex-col p-6 gap-5">

            <NavLink
              to="/dashboard"
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/create-project"
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              New Project
            </NavLink>

            <NavLink
              to="/projects"
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              Discover
            </NavLink>

            <NavLink
              to="/my-projects"
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              My Projects
            </NavLink>

            <NavLink
              to="/profile"
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </NavLink>

            <hr className="border-zinc-800" />

            <div className="text-slate-400">
              Signed in as
            </div>

            <div className="text-white font-semibold">
              {user?.name}
            </div>

            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 transition"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}