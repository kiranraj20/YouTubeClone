import * as api from "../api";

export const postHistory = (videoId, userId)=> async(dispatch) => {
  try {
    const { data } = await api.postHistory( videoId, userId );
    dispatch({ type: 'POST_HISTORY', payload: data });
    dispatch(getHistoryByUserId())
  } catch (error) {
    console.log(error)
  }
}

export const getHistoryByUserId = (userId)=> async(dispatch) => {
  try {
    // const { data } = await api.getHistoryByUserId(userId);
    // dispatch({ type: 'FETCH_ALL_HISTORY', payload: data });
  } catch (error) {
    console.log(error)
  }
}