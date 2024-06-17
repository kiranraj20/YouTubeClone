import './VideoPlayer.css';
import React, { useEffect, useRef, useState } from 'react';
import VideoControls from '../VideoControls/VideoControls';
import { useDispatch, useSelector } from 'react-redux';
import { updateVideo } from '../../Actions/Video';
import { postHistory } from '../../Actions/history';
import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ videoSrc, videoId }) => {

  const videoTag = document.querySelector('.video');
  const videoRef = useRef();
  const [resolution, setResolution] = useState('-1080p');
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef();
  const navigate = useNavigate()

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

  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState('');

  const handleGesture = (event) => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.clientWidth;
    const height = video.clientHeight;
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const tapCount = event.detail;

    if (tapCount === 1) {
      if (x > width * 0.75 && y < height * 0.25) {
        // Top-right corner
        showCurrentLocationAndTemperature();
      } else if (x > width * 0.75) {
        // Right side
        if (video.playbackRate >0 && video.playbackRate<=8) {
          video.playbackRate *= 2.0;
        }
        showTemporaryInfo('2X Speed');
      } else if (x < width * 0.25) {
        // Left side
        if (video.playbackRate >= 1 && video.playbackRate <=16) {
          video.playbackRate /= 2.0;
        }
        showTemporaryInfo('2X Slow');
      } else {
        // Center
        video.paused ? video.play() : video.pause();
        showTemporaryInfo(video.paused ? 'Paused' : 'Playing');
      }
    } else if (tapCount === 2) {
      if (x > width * 0.5) {
        // Double tap on right side
        video.currentTime += 10;
        showTemporaryInfo('+10 sec');
      } else {
        // Double tap on left side
        video.currentTime -= 10;
        showTemporaryInfo('-10 sec');
      }
    } else if (tapCount === 3) {
      if (x > width * 0.75) {
        // Three taps on right side
        showTemporaryInfo('Closing...');
        setTimeout(() => navigate('/'), 5000); // Close after 1 second
      } else if (x < width * 0.25) {
        // Three taps on left side
        showComments();
      } else {
        // Three taps in the center
      }
    }
  };
  const showCurrentLocationAndTemperature = () => {
    // Fetch location and temperature (mocked for this example)
    const location = 'India, IN';
    const temperature = ' 35°C';
    setInfoContent(`${location}, ${temperature}`);
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 3000); // Hide after 3 seconds
  };
  const showComments = () => {
    setInfoContent('Showing comments...');
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 3000); // Hide after 3 seconds
  };
  const showTemporaryInfo = (message) => {
    setInfoContent(message);
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 5000); // Hide after 1 second
  };

  return (
    <div className="video-container">
      <div className="video" id='video'>
      {showInfo && <div className="info-popup">{infoContent}</div>}
        <video
          ref={videoRef}
          src={`${videoSrc.slice(0, videoSrc.lastIndexOf('.'))}${resolution}${videoSrc.slice(videoSrc.lastIndexOf('.'))}`}
          controls={false}
          className='video-item'
          onClick={handleGesture}
          onTouchStart={handleGesture}
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
