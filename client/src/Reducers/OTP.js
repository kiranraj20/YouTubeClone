const OTPReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "OTP_VERIFY":
      return { data: action.payload };
    default: return state;
  }
};

export default OTPReducer;