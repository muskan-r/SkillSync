import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-base px-4 sm:px-6 py-16 sm:py-24 text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
        Ready to sync up?
      </h2>
      <p className="font-body text-muted mb-8 text-sm sm:text-base">
        Join SkillSync and start building alongside other developers.
      </p>
      <Link
        to="/register"
        className="w-full sm:w-auto bg-signature text-base font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-block"
      >
        Create your free account
      </Link>
    </section>
  );
}