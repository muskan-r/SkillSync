import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import * as projectService from "../services/projectService";
import AppFooter from "../components/AppFooter";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    try {
      const res = await projectService.getMyProjects();
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">My Projects</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Projects you've created and manage
        </p>

        {loading ? (
          <p className="text-zinc-400 text-sm">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            You haven't created any projects yet.
          </p>
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