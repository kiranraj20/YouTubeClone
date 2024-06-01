import axios from 'axios'

const API = axios.create({baseURL : `http://localhost:5500/`})
API.interceptors.request.use((req) => {
  if(localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
})

export const login = (authData) => API.post('/user/login', authData);

export const updateChannelData = (id,updateData) => API.patch(`/user/update/${id}`, updateData);

export const getChannel = (id) => API.get(`/user/getChannelById/${id}`);

export const uploadVideo =(fileData, fileOptions) =>API.post('/video/uploadVideo',fileData, fileOptions);

export const getVideos = () => API.get('/video/getAllVideos');

export const updateVideoById = (id, updateData) => API.patch(`/video/update/${id}`, updateData);

export const likedVideo = (userId,videoId) => API.post(`/user/like/${videoId}`,userId);

export const savedVideo = (userId,videoId) => API.post(`/user/save/${videoId}`,userId);

export const postComment = (commentData) => API.post('/comment/post',commentData);
export const deleteComment = (id) => API.delete(`/comment/delete/${id}`);
export const editComment = (id,commentBody) => API.patch(`/comment/edit/${id}`,{commentBody});
export const getAllComments = () => API.get('/comment/get');