import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TiltCard from "../components/TiltCard";
import { useAuth } from "../context/AuthContext";
import * as projectService from "../services/projectService";
import ProjectChat from "../components/ProjectChat";

const TECH_ICONS = {
  react: "⚛️",
  node: "🟢",
  nodejs: "🟢",
  mongodb: "🍃",
  express: "⚡",
  javascript: "🟨",
  typescript: "📘",
  python: "🐍",
  tailwinds: "🎨",
  tailwind: "🎨",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  const isOwner = Boolean(project && user && project.createdBy?._id === user.id);
  const isMember = Boolean(
    project && user && project.members?.some((m) => m._id === user.id)
  );

  const fetchProject = async () => {
    try {
      const res = await projectService.getProjectById(id);
      setProject(res.data.project);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await projectService.getProjectRequests(id);
      setRequests(res.data.requests);
    } catch {
      // silently ignore if not owner
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (isOwner) fetchRequests();
  }, [isOwner]);

  const handleJoinRequest = async () => {
    setMessage("");
    try {
      await projectService.requestToJoin(id);
      setMessage("Join request sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await projectService.acceptRequest(requestId);
      fetchRequests();
      fetchProject();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await projectService.rejectRequest(requestId);
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reject");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      await projectService.uploadProjectImage(id, file);
      fetchProject();
      setMessage("Image uploaded successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
  try {
    await projectService.removeProjectImage(id);
    fetchProject();
  } catch (err) {
    setMessage(err.response?.data?.message || "Failed to remove image");
  }
};

  const handleLeave = async () => {
    try {
      await projectService.leaveProject(id);
      fetchProject();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to leave");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await projectService.removeMember(id, memberId);
      fetchProject();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await projectService.deleteProject(id);
      navigate("/my-projects");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-zinc-400 text-sm animate-pulse">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-red-400 text-sm">{message || "Project not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
        </div>
        {project.image && (
          <div className="relative w-full h-64 sm:h-64  rounded-xl overflow-hidden mb-6">
            <img
            
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {isOwner && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors backdrop-blur"
              >
                Remove Image
              </button>
            )}
          </div>
        )}

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <TiltCard className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-medium">👥 Members</span>
            <span className="text-2xl font-bold text-white mt-1">
              {project.members?.length || 1}
            </span>
          </TiltCard>

          <TiltCard className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-medium">📌 Status</span>
            <div>
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize mt-1 ${
                  project.status === "open"
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                }`}
              >
                {project.status || "Open"}
              </span>
            </div>
          </TiltCard>

          <TiltCard className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-medium">💻 Tech</span>
            <span className="text-2xl font-bold text-white mt-1">
              {project.technologies?.length || 0}
            </span>
          </TiltCard>

          <TiltCard className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-zinc-400 font-medium">📅 Created</span>
            <span className="text-sm font-semibold text-zinc-200 mt-2">
              {formatDate(project.createdAt)}
            </span>
          </TiltCard>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left / Main Column */}
          <div className="md:col-span-2 space-y-6">
            <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                About the Project
              </h2>
              <p className="text-zinc-200 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {project.description}
              </p>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => {
                    const normalized = tech.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const icon = TECH_ICONS[normalized] || "⚡";
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 px-3 py-1.5 rounded-full"
                      >
                        <span>{icon}</span>
                        <span>{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {message && (
                <div className="p-3 mb-4 rounded bg-indigo-950/40 border border-indigo-800 text-indigo-300 text-sm">
                  {message}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {!isOwner && !isMember && (
                  <button
                    onClick={handleJoinRequest}
                    className="bg-[#00E5C7] hover:bg-[#00c2a8] text-black font-semibold rounded-lg px-5 py-2.5 text-sm transition-all shadow-md hover:shadow-[#00E5C7]/20 flex items-center gap-2"
                  >
                    <span>🟢</span> Request to Join
                  </button>
                )}

                {!isOwner && isMember && (
                  <button
                    onClick={handleLeave}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    Leave Project
                  </button>
                )}

                {isOwner && (
                  <>
                  <input 
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current.click()}
                    disabled={uploadingImage}
                    className="bg-[#00E5C7] hover:bg-[#00c2a8] text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>📷</span> {uploadingImage ? "Uploading..." : "Upload Image"}
                  </button>
                  
                    <button
                      onClick={() => navigate(`/projects/${id}/edit`)}
                      className="bg-[#00E5C7] hover:bg-[#00c2a8] text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center gap-2"
                    >
                      <span>📝</span> Edit Project
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-900/80 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <span>🗑</span> Delete
                    </button>
                  </>
                )}
              </div>
            </TiltCard>

            {isOwner && (
              <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>Pending Requests</span>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                    {requests.length}
                  </span>
                </h2>

                {requests.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No pending requests right now.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div
                        key={req._id}
                        className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00E5C7]/20 border border-[#00E5C7]/40 text-[#00E5C7] font-bold flex items-center justify-center text-xs">
                            {req.requestedBy?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-zinc-200">
                            {req.requestedBy?.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req._id)}
                            className="bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-900 transition-colors rounded-md px-3 py-1 text-xs font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors rounded-md px-3 py-1 text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TiltCard>
            )}

                       {(isOwner || isMember) && <ProjectChat projectId={id} />}
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">

            <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-3">
                👤 Project Owner
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00E5C7] text-black font-extrabold text-lg flex items-center justify-center shadow-lg shadow-[#00E5C7]/10">
                  {project.createdBy?.name?.[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {project.createdBy?.name || "Unknown"}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {project.createdBy?.role || "Developer"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
                <span className="hover:text-[#00E5C7] cursor-pointer transition-colors">GitHub</span>
                <span>•</span>
                <span className="hover:text-[#00E5C7] cursor-pointer transition-colors">LinkedIn</span>
                <span>•</span>
                <span className="hover:text-[#00E5C7] cursor-pointer transition-colors">Portfolio</span>
              </div>
            </TiltCard>

            <TiltCard className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">
                Team Members ({project.members?.length || 0})
              </h3>

              {!project.members || project.members.length === 0 ? (
                <p className="text-zinc-500 text-sm">No other members joined yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {project.members.map((member) => {
                    const isMemOwner = member._id === project.createdBy?._id;
                    return (
                      <div
                        key={member._id}
                        className="flex items-center justify-between bg-zinc-950/40 border border-zinc-800/80 rounded-lg p-2.5 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-200 font-bold border border-zinc-700 flex items-center justify-center text-xs">
                            {member.name?.[0]?.toUpperCase() || "M"}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-200 text-xs">
                              {member.name}
                            </p>
                          </div>
                        </div>

                        {isMemOwner ? (
                          <span className="text-[10px] bg-[#00E5C7]/10 text-[#00E5C7] border border-[#00E5C7]/30 px-2 py-0.5 rounded-full font-medium">
                            Owner
                          </span>
                        ) : (
                          isOwner && (
                            <button
                              onClick={() => handleRemoveMember(member._id)}
                              className="text-red-400 hover:text-red-300 text-xs transition-colors"
                            >
                              Remove
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TiltCard>

          </div>
        </div>

      </div>
    </div>
  );
}