import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TiltCard from "../components/TiltCard";
import * as projectService from "../services/projectService";
import AppFooter from "../components/AppFooter";

export default function Dashboard() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await projectService.getMyProjects();
        setMyProjects(res.data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalMembers = myProjects.reduce(
    (sum, p) => sum + (p.members?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Here's a snapshot of your SkillSync activity
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Your Projects</p>
            <p className="text-3xl font-bold">
              {loading ? "-" : myProjects.length}
            </p>
          </TiltCard>

          <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Total Collaborators</p>
            <p className="text-3xl font-bold">
              {loading ? "-" : totalMembers}
            </p>
          </TiltCard>

          <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Skills Listed</p>
            <p className="text-3xl font-bold">{user?.skills?.length || 0}</p>
          </TiltCard>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/create-project"
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors rounded px-4 py-2 text-sm font-medium"
          >
            + New Project
          </Link>
          <Link
            to="/projects"
            className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded px-4 py-2 text-sm font-medium"
          >
            Discover Projects
          </Link>
          <Link
            to="/profile"
            className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded px-4 py-2 text-sm font-medium"
          >
            Get AI Project Ideas
          </Link>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Your Recent Projects</h2>
          {loading ? (
            <p className="text-zinc-400 text-sm">Loading...</p>
          ) : myProjects.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              You haven't created any projects yet —{" "}
              <Link to="/create-project" className="text-indigo-400 hover:underline">
                create your first one
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-2">
              {myProjects.slice(0, 3).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm hover:border-zinc-700 transition-colors"
                >
                  <span className="font-medium">{project.title}</span>
                  <span className="text-zinc-500 text-xs">
                    {project.members?.length || 0} member(s)
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <AppFooter />
    </div>
  );
}