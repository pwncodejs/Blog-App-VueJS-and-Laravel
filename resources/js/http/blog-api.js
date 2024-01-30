import api from "./api";

const apiPath = import.meta.env.VITE_API_PATH;
const resource = apiPath + "/blogs";

export const allBlogs = () => api.get(resource);

export const blogsByStatus = (status) => api.get(`${resource}/blogsByStatus/${status}`);

export const blogsBySearch = (search) => api.post(`${resource}/blogsBySearch`,search);

export const createBlog = (blog) => api.post(resource, blog);

export const editBlog = (id) => api.get(`${resource}/${id}`);

export const updateBlog = (id, blog) => api.post(`${resource}/${id}`, blog);

export const removeBlog = (id) => api.delete(`${resource}/${id}`);

export const getBlogs = () =>  api.get(`${apiPath}/getBlogs`);

export const searchBlogs = (search) => api.post(`${apiPath}/searchBlogs`, search);

export const viewBlog = (id) => api.get(`${apiPath}/blog/${id}`);