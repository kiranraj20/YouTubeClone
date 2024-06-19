import * as api from "../api";

export const sendMessage = (from, to, message)=> async(dispatch) => {
  try {
    const { data } = await api.sendMessage( from, to, message );
    dispatch({ type: 'SEND_MESSAGE', payload: data });
  } catch (error) {
    console.log(error)
  }
}
