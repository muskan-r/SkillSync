import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Message from "./models/Message.js";

export const initSocket = (io) => {
  // ==============================
  // SOCKET AUTHENTICATION
  // ==============================
  io.use(async (socket, next) => {
    try {
      // Get token from the Socket.IO handshake cookies
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Not authorized: No authentication cookie"));
      }

      // Find token inside cookies
      const tokenMatch = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="));

      if (!tokenMatch) {
        return next(new Error("Not authorized: Token not found"));
      }

      const token = decodeURIComponent(tokenMatch.split("=")[1]);

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Not authorized: User not found"));
      }

      // Store authenticated user on socket
      socket.user = user;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);

      next(new Error("Not authorized"));
    }
  });

  // ==============================
  // CONNECTION
  // ==============================
  io.on("connection", (socket) => {
    console.log(
      `🔌 User connected: ${socket.user.name} (${socket.id})`
    );

    // ==============================
    // JOIN PROJECT CHAT
    // ==============================
    socket.on("join_project", async (projectId) => {
      try {
        // Validate project ID
        if (!projectId) {
          socket.emit("chat_error", {
            message: "Project ID is required",
          });

          return;
        }

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
          socket.emit("chat_error", {
            message: "Project not found",
          });

          return;
        }

        const userId = socket.user._id.toString();

        // Check if owner
        const isOwner =
          project.createdBy.toString() === userId;

        // Check if accepted member
        const isMember = project.members.some(
          (member) => member.toString() === userId
        );

        // Only owner OR accepted member can join
        if (!isOwner && !isMember) {
          socket.emit("chat_error", {
            message:
              "Access denied. You must be a project collaborator to access this chat.",
          });

          return;
        }

        // Join project room
        socket.join(projectId);

        console.log(
          `💬 ${socket.user.name} joined project chat: ${projectId}`
        );

        socket.emit("chat_joined", {
          projectId,
          message: "Joined project chat successfully",
        });
      } catch (error) {
        console.error("Join project error:", error.message);

        socket.emit("chat_error", {
          message: "Unable to join project chat",
        });
      }
    });

    // ==============================
    // SEND MESSAGE
    // ==============================
    socket.on(
      "send_message",
      async ({ projectId, content }) => {
        try {
          if (!projectId || !content?.trim()) {
            socket.emit("chat_error", {
              message: "Project ID and message are required",
            });

            return;
          }

          // Find project
          const project = await Project.findById(projectId);

          if (!project) {
            socket.emit("chat_error", {
              message: "Project not found",
            });

            return;
          }

          const userId = socket.user._id.toString();

          // Check owner
          const isOwner =
            project.createdBy.toString() === userId;

          // Check accepted member
          const isMember = project.members.some(
            (member) => member.toString() === userId
          );

          // SECURITY CHECK
          if (!isOwner && !isMember) {
            socket.emit("chat_error", {
              message:
                "Access denied. You are not a collaborator on this project.",
            });

            return;
          }

          // Make sure socket actually joined this project room
          const room = io.sockets.adapter.rooms.get(projectId);

          const isInRoom = room?.has(socket.id);

          if (!isInRoom) {
            socket.emit("chat_error", {
              message: "You must join the project chat first.",
            });

            return;
          }

          // Create message using AUTHENTICATED USER
          const message = await Message.create({
            project: projectId,
            sender: socket.user._id,
            content: content.trim(),
          });

          // Send message to project members
          io.to(projectId).emit("receive_message", {
            _id: message._id,
            projectId,
            senderId: socket.user._id,
            senderName: socket.user.name,
            content: message.content,
            createdAt: message.createdAt,
          });
        } catch (error) {
          console.error(
            "Socket message error:",
            error.message
          );

          socket.emit("chat_error", {
            message: "Failed to send message",
          });
        }
      }
    );

    // ==============================
    // LEAVE PROJECT CHAT
    // ==============================
    socket.on("leave_project", (projectId) => {
      if (projectId) {
        socket.leave(projectId);

        console.log(
          `👋 ${socket.user.name} left project chat: ${projectId}`
        );
      }
    });

    // ==============================
    // DISCONNECT
    // ==============================
    socket.on("disconnect", () => {
      console.log(
        `🔌 User disconnected: ${socket.user.name} (${socket.id})`
      );
    });
  });
};