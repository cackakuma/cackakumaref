import axios from 'axios';

const API = axios.create({
  baseURL: "https://cackakuma-backend.onrender.com", 
});


export const getOrgsDet = () => API.get("/cac/");
export const addOrgsDet = (formData) => API.post("/cac/", formData);
export const updateOrgsDet = (id, data) => {
  if (data instanceof FormData) {
    return API.put(`/cac/${id}`, data);
  } else {
    return API.put(`/cac/${id}`, data);
  }
};

export const deleteOrgDet = (id) => API.delete(`/cac/${id}`);

export const getPartners = () => API.get("/cac/partners");
export const addPartner = (data) => {
  if (data instanceof FormData) {
    return API.post("/cac/partners", data);
  } else {
    return API.post("/cac/partners", data);
  }
};

export const updatePartner = (id, data) => {
  if (data instanceof FormData) {
    return API.put(`/cac/partners/${id}`, data);
  } else {
    return API.put(`/cac/partners/${id}`, data);
  }
};
export const deletePartner = (id) => API.delete(`/cac/partners/${id}`);


export const getFeedbacks = () => API.get("/cac/feedbacks");
export const addFeedback = (task) => API.post("/cac/feedbacks", task);
export const updateFeedback = (id, task) => API.put(`/cac/feedbacks/${id}`, task);
export const deleteFeedback = (id) => API.delete(`/cac/feedbacks/${id}`);


export const getTestimonies = () => API.get("/cac/testimonies");
export const addTestimony = (task) => API.post("/cac/testimonies", task);
export const updateTestimony = (id, task) => API.put(`/cac/testimonies/${id}`, task);
export const deleteTestimony = (id) => API.delete(`/cac/testimonies/${id}`);


export const getPosts = () => API.get("/cac/posts");
export const addPost = (formData) => API.post("/cac/posts", formData);
export const updatePost = (id, data) => {
  // Check if data is FormData (for file uploads) or regular object (for image deletion)
  if (data instanceof FormData) {
    return API.put(`/cac/posts/${id}`, data);
  } else {
    // For regular JSON updates (like image deletion)
    return API.put(`/cac/posts/${id}`, data);
  }
};
export const deletePost = (id) => API.delete(`/cac/posts/${id}`);

export const getMembers = () => API.get("/cac/members");
export const addMember = (formData) => API.post("/cac/members", formData);
export const updateMember = (id, data) => 
  {
  // Check if data is FormData (for file uploads) or regular object (for image deletion)
  if (data instanceof FormData) {
    return API.put(`/cac/members/${id}`, data);
  } else {
    // For regular JSON updates (like image deletion)
    return API.put(`/cac/members/${id}`, data);
  }
};
export const deleteMember = (id) => API.delete(`/cac/members/${id}`);


export const getPrograms = () => API.get("/cac/programs");
export const addProgram = (task) => API.post("/cac/programs", task);
export const updateProgram = (id, task) => API.put(`/cac/programs/${id}`, task);
export const deleteProgram = (id) => API.delete(`/cac/programs/${id}`);
