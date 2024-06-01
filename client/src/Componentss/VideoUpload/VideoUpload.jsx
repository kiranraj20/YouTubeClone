import React, { useState } from 'react'
import './VideoUpload.css'
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo } from '../../Actions/Video';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const VideoUpload = ({ upload , setUpload }) => {

  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState('')
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const selector = useSelector(state => state.authReducer.data)

  const fileOptions={
    onUploadProgress:(ProgressEvent)=>{
      const {loaded, total} = ProgressEvent;
      const percentage = Math.floor(((loaded/1000)*100)/(total/1000));
      setProgress(percentage)
      if (percentage === 100) {
        setTimeout(function(){},3000);
        setUpload(!upload);
      }
    }
  }

  const handleUpload = () => {
    if (!title) {
      alert('Title cannot be empty...!')
    } else if(!videoFile){
      alert('A Video File is required to upload a video...!')
    }else if(videoFile.size > 31457280){
      alert(`Video file size cannot exceed 30MB`)
    }else {
      try {
        const fileData = new FormData();
        fileData.append('file', videoFile);
        fileData.append('title', title);
        fileData.append('channel', selector?.result._id);
        fileData.append('uploader', selector?.result.name);
        // const formDataObject = {};
        // for(const [key , value] of fileData){
        //   formDataObject[key] = value;
        // }
        dispatch(uploadVideo({
          fileData: fileData,
          fileOptions: fileOptions
        }));
      } catch (error) {
        console.error('Error creating FormData:', error);
        alert('An error occurred while preparing the upload. Please try again.');
      }
    }
  }
  
  return (
    <div className='upload-video-tab'>
      <div className="upload-video-head">
        Upload Video
        <MdClose className='upload-video-close-btn' onClick={()=>setUpload(!upload)} />
      </div>
      <div className="upload-video-body">
        <div className="i-title-box">
          <input className='i-title' type="text" placeholder='Enter Title of Your Video' onChange={(e)=>setTitle(e.target.value)} />
        </div>
        <div className="upload-file">
          <input className='file-btn' type='file' onChange={(e)=>setVideoFile(e.target.files[0])} />
          <div className="loader "><CircularProgressbar 
          value={progress}
          text={`${progress}`}
          styles={
            buildStyles({
              rotation:0.25,
              strokeLinecap:'butt',
              textSize:'20px',
              pathTransitionDuration:0.5,
              pathColor:`rgba(255,255,255,${progress/100})`,
              trailColor:'#adff2f',
            })
          }
          /></div>
        </div>
        <div className="upload-btn" onClick={handleUpload}>Upload</div>
      </div>
    </div>
  )
}

export default VideoUpload