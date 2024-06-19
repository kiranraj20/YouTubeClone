import * as api from '../api'

export const login = (authData) => async(dispatch) => {
  try {
    const { data } = await api.login(authData);
    dispatch({ type: 'AUTH', data });
    dispatch({ type: 'LOGIN' });
  } catch (error) {
    console.error('Login Error:', error);
  }
};


export const logout = () => async(dispatch) => {
  try {
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.log(error);
  }
}; 