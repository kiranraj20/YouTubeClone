const videoReducer =(state= {data:null}, action)=>{
  switch(action.type) {
    case 'POST_VIDEO': 
        return {...state}
    case 'FETCH_ALL_VIDEOS': 
        return {...state,data:action.payload}
    case 'UPDATE_VIDEO':
        return {
          ...state,
          data: state.data.map((video) =>
            video._id === action.payload.id ? { ...video, ...action.payload } : video
          ),
        };
    default: return state;
  }
}
export default videoReducer