import api from "./api";

export const getProjectMessages = (projectId) =>
  api.get(`/messages/${projectId}`);