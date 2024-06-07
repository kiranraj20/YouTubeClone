const historyReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "POST_HISTORY":
      return { ...state };
    case "FETCH_ALL_HISTORY":
      return { ...state, data: action.payload };
    default: return state;
  }
};

export default historyReducer;