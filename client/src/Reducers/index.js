import { combineReducers } from 'redux';
import counterReducer from './CounterReducer'; // Import counterReducer
import isLoggedReducer from './IsLoggedReducer'; // Import isLoggedReducer
import authReducer from "./auth.js"
import currentUserReducer from './currentUser.js'
import channelReducers from './channel.js';
import videoReducer from './video.js';
import commentReducer from './comments.js';

export default combineReducers({
  counter: counterReducer,
  isLogged: isLoggedReducer,
  authReducer,
  currentUserReducer,
  channelReducers,
  videoReducer,
  commentReducer,
});
