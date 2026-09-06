import TiltCard from "../TiltCard";

const features = [
  {
    title: "Showcase your work",
    desc: "Build a profile that reflects your real skills and projects, not just a resume PDF.",
  },
  {
    title: "Find your collaborators",
    desc: "Discover developers by tech stack, request to join projects, and build together.",
  },
  {
    title: "AI-guided growth",
    desc: "Get personalized project ideas and description feedback powered by Gemini AI.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-base px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-10 sm:mb-12">
          Everything you need to grow as a developer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, i) => (
            <TiltCard
              key={f.title}
              className="bg-surface border border-zinc-800 rounded-xl p-6"
            >
              <span className="font-mono text-signature text-xs">
                0{i + 1}
              </span>
              <h3 className="font-display text-white text-base sm:text-lg font-bold mt-2 mb-2">
                {f.title}
              </h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                {f.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}