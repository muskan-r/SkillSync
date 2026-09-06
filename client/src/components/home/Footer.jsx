import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-center lg:justify-between gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 bg-gradient-to-r from-base via-surface to-base border-t border-zinc-800">
      <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[100px]">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="font-display font-bold text-lg text-white"
          >
            Skill<span className="text-signature">Sync</span>
          </Link>

          <p className="font-body text-muted text-sm mt-3 max-w-[220px]">
            Where developers sync skills and build together.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <p className="font-mono text-xs text-signature uppercase tracking-wider mb-3">
            Product
          </p>

          <ul className="space-y-2 font-body text-sm text-muted">
            <li>
              <Link
                to="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How it Works
              </a>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <p className="font-mono text-xs text-signature uppercase tracking-wider mb-3">
            Account
          </p>

          <ul className="space-y-2 font-body text-sm text-muted">
            <li>
              <Link
                to="/dashboard"
                className="hover:text-signature transition-colors"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </li>

            <li>
              <Link
                to="/login"
                className="hover:text-white transition-colors"
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end max-md:items-center max-md:text-center gap-2">
        <p className="max-w-64 font-body text-muted text-sm">
          Built as a full-stack MERN application with AI-powered collaboration
          features.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mt-3">
          {/* GitHub */}
          <a
            href="https://github.com/muskan-r"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-signature transition-all duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.96.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/muskangulati999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-signature transition-all duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>

        <p className="mt-4 text-xs text-muted font-body">
          © {new Date().getFullYear()} SkillSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;