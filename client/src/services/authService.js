import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.post("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/auth/upload-avatar", formData, {
        headers: {"Content-Type": "multipart/form-data" },
        });
    };