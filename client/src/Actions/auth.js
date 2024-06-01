import * as api from '../api'

export const login = (authData) => async(dispatch) => {
  try {
    const { data } = await api.login(authData);
    dispatch({ type: 'AUTH', data });
  } catch (error) {
    console.error('Login Error:', error); // Log the entire error object
  }
};


export const logout = () => async(dispatch) => {
  try {
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.log(error);
  }
};