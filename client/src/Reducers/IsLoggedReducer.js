// isLoggedReducer.js

// Define an initial state for the login status
const initialState = {
  isLoggedIn: false
};

// Define the isLogged reducer function
const isLoggedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { isLoggedIn: true };
    case 'LOGOUT':
      return { isLoggedIn: false };
    default:
      return state;
  }
};

export default isLoggedReducer;
