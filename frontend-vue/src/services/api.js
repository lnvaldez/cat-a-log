import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const api = {
  // Links
  getAllLinks: () => axios.get(`${API_URL}/links`),
  getLink: (id) => axios.get(`${API_URL}/links/${id}`),
  createLink: (data) => axios.post(`${API_URL}/links`, data),
  updateLink: (id, data) => axios.put(`${API_URL}/links/${id}`, data),
  deleteLink: (id) => axios.delete(`${API_URL}/links/${id}`),
  voteLink: (id, vote) => axios.post(`${API_URL}/links/${id}/vote`, { vote }),

  // Comments
  getComments: (linkId) => axios.get(`${API_URL}/comments/${linkId}`),
  createComment: (data) => axios.post(`${API_URL}/comments`, data),
}
