import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import * as projectService from "../services/projectService";
import AppFooter from "../components/AppFooter";

export default function Discover() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (tech) params.tech = tech;

      const res = await projectService.getProjects(params);
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Discover Projects</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Browse projects and find ones to collaborate on
        </p>

        <form onSubmit={handleFilter} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Tech (comma separated)"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="w-64 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors rounded px-4 py-2 text-sm font-medium"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-zinc-400 text-sm">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-zinc-400 text-sm">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
      <AppFooter/>
    </div>
  );
}