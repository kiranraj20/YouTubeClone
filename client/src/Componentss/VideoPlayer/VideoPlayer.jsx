import './VideoPlayer.css';
import React, { useEffect, useRef, useState } from 'react';
import VideoControls from '../VideoControls/VideoControls';
import { useDispatch, useSelector } from 'react-redux';
import { updateVideo } from '../../Actions/Video';
import { postHistory } from '../../Actions/history';

const VideoPlayer = ({ videoSrc, videoId }) => {

  const videoTag = document.querySelector('.video');
  const videoRef = useRef();
  const [resolution, setResolution] = useState('-1080p');
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef();

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 5000);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      videoElement.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const selector = useSelector(state=> state?.videoReducer?.data)
  const [ids, setIds] = useState([])
  const dispatch = useDispatch();
  const userId = useSelector(state=> state.authReducer?.data?.result?._id)

  const addIdsWithoutDuplicates = (prev, newItems) => {
    const idsSet = new Set(prev.map(item => item._id));
    const filteredNewItems = newItems.filter(item => !idsSet.has(item._id));
    return [...prev, ...filteredNewItems];
  };
  
  useEffect(() => {
    const res = ['', '-360p', '-480p', '-720p', '-1080p']
    res.forEach((item) => {
      const lol = selector.filter((value)=> value.filePath === `${videoSrc.slice(22,videoSrc.lastIndexOf('.'))}${item}${videoSrc.slice(videoSrc.lastIndexOf('.'))}`)
      const id = lol.map(i => ({ _id: i._id, views: i.Views }))
      setIds((prev) => addIdsWithoutDuplicates(prev, id))
    })
  }, [selector,videoSrc]);

  const handleVideoEnded = () => {
    ids.forEach(item => {
      dispatch(updateVideo(item._id, { 'Views': item.views+1 }))
      dispatch(postHistory(item._id, userId))
      
    })
  }

  

  return (
    <div className="video-container">
      <div className="video" id='video'>
        <video
          ref={videoRef}
          src={`${videoSrc.slice(0, videoSrc.lastIndexOf('.'))}${resolution}${videoSrc.slice(videoSrc.lastIndexOf('.'))}`}
          controls={false}
          className='video-item'
          onEnded={handleVideoEnded}
        />
        <VideoControls 
          videoRef={videoRef} 
          videoTag={videoTag} 
          resolution={resolution} 
          setResolution={setResolution} 
          showControls={showControls} 
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
