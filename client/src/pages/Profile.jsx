import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import * as authService from "../services/authService";
import * as aiService from "../services/aiService";
import AppFooter from "../components/AppFooter";

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [skillsInput, setSkillsInput] = useState((user?.skills || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [suggestions, setSuggestions] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await authService.updateProfile({ bio, skills });
      await fetchUser();
      setMessage("Profile updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSuggest = async () => {
    setLoadingAI(true);
    setAiError("");
    setSuggestions("");
    try {
      const res = await aiService.suggestProjects();
      setSuggestions(res.data.suggestions);
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to get suggestions");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    try {
      await authService.uploadAvatar(file);
      await fetchUser();
      setMessage("Avatar updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-bold mb-1">Your Profile</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-zinc-500">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="bg-zinc-800 hover:bg-zinc-700 text-sm px-3 py-1.5 rounded transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Change photo"}
              </button>
            </div>
          </div>
          <p className="text-zinc-400 text-sm mb-6">{user?.email}</p>

          {message && (
            <p className="text-sm text-indigo-400 mb-4">{message}</p>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell others about yourself"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <h2 className="text-lg font-bold mb-1">AI Project Ideas</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Get project suggestions based on your skills
          </p>

          <button
            onClick={handleSuggest}
            disabled={loadingAI}
            className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loadingAI ? "Thinking..." : "Suggest project ideas"}
          </button>

          {aiError && (
            <p className="text-red-400 text-sm mt-3">{aiError}</p>
          )}

          {suggestions && (
            <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded p-4 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {suggestions}
            </div>
          )}
        </div>
      </div>
      <AppFooter />
    </div>
  );
}