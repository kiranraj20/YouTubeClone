import React, { useState } from 'react'
import Videos from '../../Componentss/Videos/Videos';
import { TiEdit } from "react-icons/ti";
import { FaUpload } from "react-icons/fa";
import './Channel.css';
import VideoUpload from '../../Componentss/VideoUpload/VideoUpload';
import { useSelector } from 'react-redux';


const Channel = () => {

  const [upload , setUpload] = useState(false)
  const {authReducer, videoReducer} = useSelector(state=>state)
  const channelId = authReducer?.data?.result._id
  const profile = JSON.parse(localStorage.getItem("profile"));
  const vids = videoReducer?.data?.filter(item=>item.videoChannel === channelId);

  return (
    <div>
      <div className="channel-head">
        <div className="channel-logo">{profile?.result?.name?.charAt(0).toUpperCase()}</div>
        <div className="channel-text">{profile?.result?.name}</div>
        <div className="channel-desc">{profile?.result?.desc}</div>
      </div>
      <div className="channel-body"><Videos vids={vids} /></div>
      <div className="channel-edit-btn"><TiEdit /> Edit Channel</div>
      <div className="channel-upload-btn" onClick={()=>setUpload(!upload)}><FaUpload /> Upload Video</div>
      {upload && (<div className='upload-video-btn'><VideoUpload upload={upload} setUpload={setUpload} /></div>)}
    </div>
  )
}

export default Channel