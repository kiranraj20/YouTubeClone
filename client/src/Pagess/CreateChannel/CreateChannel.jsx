import React, { useState } from 'react';
import './CreateChannel.css';
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Actions/auth';
import { updateChannelData } from '../../Actions/channelUser';

const CreateChannel = ({ channel, setChannel }) => {

  const selector = useSelector(state => state.authReducer.data);
  const [name, setName] = useState(selector?.result.name);
  const [desc, setDesc] = useState(selector?.result.desc);
  const storage = JSON.parse(localStorage.getItem('profile'));

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!name) {
      alert("please provide a name for your channel.");
    }else if(!desc) {
      alert("please provide a description for your channel.");
    }else{
      console.log(selector)
      dispatch(updateChannelData(selector?.result._id,{
        name:name,
        desc:desc,
      }));
      setChannel(!channel);
      setTimeout(() => {
        dispatch(login({ email: selector?.result.email}))
      }, 5000);
    }
  }

  return (
    <div className='create-channel'>
      <div className="create-channel-head">
        <h4>{selector?.result.name||storage.result.name ? `Edit Channel` : `Create Channel`}</h4>
        <MdClose className='channel-close-btn' onClick={() => setChannel(false)} />
      </div>
      <div className="channel-name">
        <input type="text" placeholder='ChannelName' className='i-channel-name' onChange={(e)=>setName(e.target.value)} />
      </div>
      <div className="channel-desc">
        <textarea type="text" placeholder='Description for yor Channel' className='i-channel-desc' onChange={(e)=>setDesc(e.target.value)} />
      </div>
      <div className="channel-submit">
        <input type='submit' className='channel-submit-btn' value={'Create'} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateChannel;
