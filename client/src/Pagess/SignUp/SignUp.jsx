
import React, { useEffect, useState } from 'react';
import './SignUp.css'
import { useDispatch, useSelector } from 'react-redux';
import { OTP, verifyEmail } from '../../Actions/OTP';
import { login } from '../../Actions/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOTP] = useState('');
  const [otpError, setOTPError] = useState('');
  const [OTPVisible, setOTPVisible] = useState(false)
  const dispatch = useDispatch()
  const status = useSelector(state => state?.OTPReducer?.data?.status)
  const navigate = useNavigate()

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const handleSubmitEmail = (event) => {
    event.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    alert(`OTP has been sent to ${email} please check in ETHEREAL mail box..`)
    setEmailError('');
    setOTPVisible(true)
    dispatch(verifyEmail(email))
  };
  const handleSubmitOTP = (event) => {
    event.preventDefault();
    if (!otp || !/^\d{6}$/.test(otp)) {
      setOTPError('Please enter a valid OTP (6 digits)');
      return;
    }
    setOTPError('');
    dispatch(OTP(otp));
  };

  useEffect(() => {
    if (status === 'OK') {
      dispatch(login({ email: email }));
      navigate('/');
    }
  }, [status,dispatch,email,navigate])
  

  return (
    <div className='form-box'>
    <form className='form' onSubmit={handleSubmitEmail} style={{ backgroundColor: 'transparent' }}>
      <h2 className='h2'>Login / Signup</h2>
      <div>
        <label className='label'>Email:</label>
        <input
          className='input'
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
        />
        {emailError && <p className="error">{emailError}</p>}
      </div>
      <button className='button-signup' type="submit">Send OTP</button>
    </form>
    <form className='form' onSubmit={handleSubmitOTP} style={{ backgroundColor: 'transparent' }}>
      <h2 className='h2'>Enter OTP</h2>
      <div>
        <label className='label'>OTP:</label>
        <input
          disabled={!OTPVisible}
          className='input'
          type="text"
          value={otp}
          onChange={handleOTPChange}
          placeholder="Enter OTP"
        />
        {otpError && <p className="error">{otpError}</p>}
      </div>
      <button className='button-signup' disabled={!OTPVisible} type="submit">Submit</button>
    </form>
    </div>
  );
};

export default SignUp;
