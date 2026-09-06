import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TiltCard from "../components/TiltCard";
import * as projectService from "../services/projectService";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    status: "open",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectService.getProjectById(id);
        const project = res.data.project;

        setForm({
          title: project.title || "",
          description: project.description || "",
          technologies: (project.technologies || []).join(", "),
          status: project.status || "open",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const technologies = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await projectService.updateProject(id, {
        title: form.title,
        description: form.description,
        technologies,
      });

      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <p className="text-zinc-400 text-sm p-10">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Edit Project</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Update your project details
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E5C7]"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E5C7]"
              />
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
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00E5C7]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#00E5C7] hover:bg-[#00c2a8] text-black font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg px-5 py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </TiltCard>
      </div>
    </div>
  );
}