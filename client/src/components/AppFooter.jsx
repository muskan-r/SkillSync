import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Logo */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-wide"
            >
              Skill
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sync
              </span>
            </Link>

            <p className="text-zinc-400 mt-3 max-w-sm">
              Connect with developers, collaborate on projects, and grow your
              skills together using AI-powered learning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-zinc-400">

              <li>
                <Link
                  to="/"
                  className="hover:text-cyan-400 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-cyan-400 transition duration-300"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/projects"
                  className="hover:text-cyan-400 transition duration-300"
                >
                  Discover Projects
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-cyan-400 transition duration-300"
                >
                  Profile
                </Link>
              </li>

            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-4">

              {/* GitHub */}
              <a
                href="https://github.com/muskan-r"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-cyan-500 hover:scale-110 transition-all duration-300"
              >
                🐙
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/muskangulati999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300"
              >
                💼
              </a>

              {/* Email */}
              {/* <a
                href="mailto:your@email.com"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-green-500 hover:scale-110 transition-all duration-300"
              >
                ✉️
              </a> */}

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">

          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-cyan-400 font-semibold">
              SkillSync
            </span>
            . All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}