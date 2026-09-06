import api from "./api";

export const suggestProjects = () => api.get("/ai/suggest-projects");
export const reviewDescription = (description) => api.post("/ai/review-description", { description });