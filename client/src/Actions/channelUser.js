import * as api from '../api';

export const getChannel = (id) => async (dispatch) => {
  try {
    const { data } = await api.getChannel(id);  // Correctly named function
    dispatch({ type: 'GET_CHANNEL_BY_ID', payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const updateChannelData = (id,updateData) => async(dispatch) => {
  try {
    const {data} = await api.updateChannelData(id,updateData);
    dispatch({type: 'UPDATE_DATA', payload: data})
  } catch (error) {
    console.log(error)
  }
};

export const likedVideo = (userId,videoId) => async(dispatch) => {
  try{
    const {data} = await api.likedVideo(userId,videoId);
    dispatch({type: 'LIKED_VIDEO', payload: data})
  } catch (error) {
    console.log(error)
  }
}

export const savedVideo = (userId,videoId) => async(dispatch) => {
  try{
    const {data} = await api.savedVideo(userId,videoId);
    dispatch({type: 'SAVED_VIDEO', payload: data})
  } catch (error) {
    console.log(error)
  }
}