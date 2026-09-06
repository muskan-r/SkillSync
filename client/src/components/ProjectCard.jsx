import { Link } from "react-router-dom";
import TiltCard from "./TiltCard";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`}>
      <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 h-full flex flex-col justify-between">
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-white truncate">
              {project.title}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                project.status === "open"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono bg-indigo-950/50 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-800">
          <span>by {project.createdBy?.name || "Unknown"}</span>
          <span>{project.members?.length || 0} member(s)</span>
        </div>
      </TiltCard>
    </Link>
  );
}