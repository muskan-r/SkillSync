import Notification from "../models/Notification.js";

const createNotification = async ({ user, message, type, project }) => {
  try {
    await Notification.create({ user, message, type, project });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

export default createNotification;