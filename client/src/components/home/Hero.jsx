import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative bg-base text-white px-4 sm:px-6 py-20 sm:py-28 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none"
        preserveAspectRatio="none"
      >
        <line x1="10%" y1="20%" x2="40%" y2="60%" stroke="#00E5C7" strokeWidth="1" />
        <line x1="60%" y1="15%" x2="85%" y2="50%" stroke="#7C8CFF" strokeWidth="1" />
        <circle cx="10%" cy="20%" r="3" fill="#00E5C7" />
        <circle cx="40%" cy="60%" r="3" fill="#00E5C7" />
        <circle cx="60%" cy="15%" r="3" fill="#7C8CFF" />
        <circle cx="85%" cy="50%" r="3" fill="#7C8CFF" />
      </svg>

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs text-signature tracking-widest uppercase mb-4">
          Learn · Build · Sync
        </p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
          Where developers{" "}
          <span className="text-signature">sync skills</span>{" "}
          and build together
        </h1>
        <p className="font-body text-muted text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto px-2">
          Showcase your projects, find collaborators who match your stack,
          and get AI-guided suggestions on what to build next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-signature text-base font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-signature text-base font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto border border-zinc-700 text-white px-6 py-3 rounded-lg hover:border-zinc-500 transition-colors text-center"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}