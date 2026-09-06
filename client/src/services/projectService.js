import api from "./api";

export const getProjects = (params) => api.get("/projects", { params });
export const getMyProjects = () => api.get("/projects/my-projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const requestToJoin = (id) => api.post(`/projects/${id}/request`);
export const getProjectRequests = (id) => api.get(`/projects/${id}/requests`);
export const acceptRequest = (requestId) => api.put(`/projects/request/${requestId}/accept`);
export const rejectRequest = (requestId) => api.put(`/projects/request/${requestId}/reject`);
export const leaveProject = (id) => api.put(`/projects/${id}/leave`);
export const removeMember = (id, memberId) => api.put(`/projects/${id}/members/${memberId}/remove`);
export const uploadProjectImage = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.put(`/projects/${id}/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const removeProjectImage = (id) => api.delete(`/projects/${id}/remove-image`);