import Message from "../models/Message.js";
import Project from "../models/Project.js";

export const getProjectMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user.id;
    const isOwner = project.createdBy.toString() === userId;
    const isMember = project.members.some(
      (member) => member.toString() === userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "Access denied. You must be a project collaborator to view this chat.",
      });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};