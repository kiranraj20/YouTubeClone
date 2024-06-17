import * as api from "../api";

export const verifyEmail = (email) => async (dispatch) => {
  try {
    const {data}= await api.verifyEmail(email)
    console.log(data)
  } catch (error) {
    alert(error.response.data.message)
  }
};
export const OTP = (OTP) => async (dispatch) => {
  try {
    const {data}= await api.OTP(OTP)
    console.log(data)
    dispatch({ type: 'OTP_VERIFY', payload: data });
  } catch (error) {
    alert(error.response.data.message)
  }
};