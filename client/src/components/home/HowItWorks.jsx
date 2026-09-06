import TiltCard from "../TiltCard";

const steps = [
  { label: "Showcase", desc: "Create your profile and list your skills and projects." },
  { label: "Discover", desc: "Browse projects that match your interests and stack." },
  { label: "Sync", desc: "Request to join, collaborate, and grow together." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface px-4 sm:px-6 py-16 sm:py-20 border-y border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-10 sm:mb-14">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, i) => (
            <TiltCard
              key={step.label}
              className="bg-base border border-zinc-800 rounded-xl p-6 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-signature/10 border border-signature/40 text-signature font-mono text-sm flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-display text-white font-bold mb-1 text-base">
                {step.label}
              </h3>
              <p className="font-body text-muted text-sm">{step.desc}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}