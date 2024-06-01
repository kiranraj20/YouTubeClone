
const currentUserReducer = (state=null, action)=>{
    switch (action.type) {
      case 'FETCH_CURRENT_USER':
          return {...state}
      default: return state; 
    }
  }
  export default currentUserReducer;