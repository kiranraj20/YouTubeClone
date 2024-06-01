const channelReducers = (states=null, action) => {
  switch (action.type){
    case 'UPDATE_DATA': 
        return states.map(state=>state._id===action.payload._id?action.payload:state)
    case 'GET_CHANNEL_BY_ID': 
        return action.payload
    case 'LIKED_VIDEO' :
        return action.payload
    case 'SAVED_VIDEO' :
        return action.payload
    default: return states; 
  }
}

export default channelReducers;