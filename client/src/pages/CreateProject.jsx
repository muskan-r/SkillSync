import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TiltCard from "../components/TiltCard";
import * as projectService from "../services/projectService";
import * as aiService from "../services/aiService";

export default function CreateProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [review, setReview] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleReview = async () => {
    if (!form.description.trim()) {
      setReviewError("Write a description first");
      return;
    }
    setReviewing(true);
    setReviewError("");
    setReview("");
    try {
      const res = await aiService.reviewDescription(form.description);
      setReview(res.data.review);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to get review");
    } finally {
      setReviewing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const technologies = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await projectService.createProject({
        title: form.title,
        description: form.description,
        technologies,
      });

      navigate(`/projects/${res.data.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Create a Project</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Share what you're building and find collaborators
        </p>

        <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-8">
          {error && (
            <p className="text-red-400 text-sm mb-4 bg-red-950/40 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. SkillSync"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-zinc-400">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={reviewing}
                  className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  {reviewing ? "Reviewing..." : "✨ Get AI feedback"}
                </button>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What does this project do?"
              />

              {reviewError && (
                <p className="text-red-400 text-xs mt-2">{reviewError}</p>
              )}

              {review && (
                <div className="mt-3 bg-indigo-950/30 border border-indigo-900 rounded p-3 text-xs text-indigo-200 whitespace-pre-wrap leading-relaxed">
                  {review}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create project"}
            </button>
          </form>
        </TiltCard>
      </div>
    </div>
  );
}