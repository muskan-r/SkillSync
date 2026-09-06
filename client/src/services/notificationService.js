import api from "./api";

export const getNotifications = () => api.get("/notifications");
export const markAsRead = () => api.put("/notifications/mark-read");