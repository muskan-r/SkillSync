import Project from "../models/Project.js";
import Collaboration from "../models/Collaboration.js";
import createNotification from "../utils/createNotification.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, technologies } = req.body;

    if (!title.trim() || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const project = await Project.create({
      title,
      description,
      technologies,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { tech, status, search } = req.query;

    const filter = {};

    if (tech) {
      filter.technologies = { $in: tech.split(",") };
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(filter)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project fetched successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, technologies } = req.body;

    // Find project
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this project",
      });
    }

    // Update only provided fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (technologies) project.technologies = technologies;

    // Save changes
    const updatedProject = await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this project",
      });
    }

    // Delete project
    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const requestToJoinProject = async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if user is the owner
    if (project.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot request to join your own project",
      });
    }

    // Check if project is open
    if (project.status === "closed") {
      return res.status(400).json({
        message: "This project is closed for collaboration",
      });
    }

    // Check if user is already a member
    const isMember = project.members.some(
      (member) => member.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        message: "You are already a member of this project",
      });
    }

    // Check for existing pending request
    const existingRequest = await Collaboration.findOne({
      requestedBy: req.user.id,
      project: project._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already requested to join this project",
      });
    }

    // Create collaboration request
    const collaboration = await Collaboration.create({
      requestedBy: req.user.id,
      project: project._id,
    });

    // 🔔 Notify the project owner
    await createNotification({
      user: project.createdBy,
      message: `${req.user.name} requested to join "${project.title}"`,
      type: "join_request",
      project: project._id,
    });

    res.status(201).json({
      message: "Join request sent successfully",
      collaboration,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "My projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProjectRequests = async (req, res) => {
  try {
    // Find the project
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only the owner can view requests
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Get all pending requests
    const requests = await Collaboration.find({
      project: project._id,
      status: "pending",
    }).populate("requestedBy", "name email");

    res.status(200).json({
      message: "Pending requests fetched successfully",
      requests,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const acceptJoinRequest = async (req, res) => {
  try {
    // Find the collaboration request
    const collaboration = await Collaboration.findById(req.params.requestId);

    if (!collaboration) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Find the project
    const project = await Project.findById(collaboration.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only the project owner can accept requests
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Check if the request has already been processed
    if (collaboration.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    // Update request status
    collaboration.status = "accepted";

    // Check if the user is already a member
    const isMember = project.members.some(
      (member) => member.toString() === collaboration.requestedBy.toString()
    );

    // Add the user only if they are not already a member
    if (!isMember) {
      project.members.push(collaboration.requestedBy);
    }

    // Save both documents
    await Promise.all([
      collaboration.save(),
      project.save(),
    ]);

    // 🔔 Notify the requester
    await createNotification({
      user: collaboration.requestedBy,
      message: `Your request to join "${project.title}" was accepted`,
      type: "request_accepted",
      project: project._id,
    });

    res.status(200).json({
      message: "Join request accepted successfully",
      collaboration,
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const rejectJoinRequest = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.requestId);

    if (!collaboration) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const project = await Project.findById(collaboration.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only the project owner can reject requests
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (collaboration.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    collaboration.status = "rejected";
    await collaboration.save();

    await createNotification({
      user: collaboration.requestedBy,
      message: `Your request to join "${project.title}" was declined`,
      type: "request_rejected",
      project: project._id,
    });

    res.status(200).json({
      message: "Join request rejected successfully",
      collaboration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Owner can't "leave" their own project
    if (project.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        message: "Project owner cannot leave the project. Delete it instead.",
      });
    }

    const isMember = project.members.some(
      (member) => member.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(400).json({
        message: "You are not a member of this project",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== req.user.id
    );

    await project.save();

    res.status(200).json({
      message: "You have left the project",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only the owner can remove members
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { memberId } = req.params;

    const isMember = project.members.some(
      (member) => member.toString() === memberId
    );

    if (!isMember) {
      return res.status(400).json({
        message: "This user is not a member of the project",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== memberId
    );

    await project.save();

    res.status(200).json({
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this project",
      });
    }

    project.image = req.file.path; // Cloudinary URL
    await project.save();

    res.status(200).json({
      message: "Project image uploaded successfully",
      image: project.image,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this project",
      });
    }

    project.image = "";
    await project.save();

    res.status(200).json({
      message: "Project image removed successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
