import React from 'react'
import './VideoControls.css'
import { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { IoVolumeHigh, IoVolumeOff , IoVolumeLow , IoVolumeMedium , IoVolumeMute  } from "react-icons/io5";
import { MdOutlineFullscreen, MdOutlineFullscreenExit  } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";

const VideoControls = ({videoRef, videoTag, resolution, setResolution ,showControls}) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [videoRes, setVideoRes] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);

  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
    videoRef.current.load();
    setVideoRes(!videoRes)
    setMenu(!menu)
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    videoRef.current.volume = isMuted ? volume : 0;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVolumeIcon = (v) => {
    if (v === 0) return <IoVolumeOff />;
    if (v <= 0.4) return <IoVolumeLow />;
    if (v <= 0.7) return <IoVolumeMedium />;
    return <IoVolumeHigh />;
  };

  const handleFullscreen = (videoTag) => {
    setFullscreen(!fullscreen);
    if (!document.fullscreenElement) {
      if (videoTag.requestFullscreen) videoTag.requestFullscreen();
      else if (videoTag.mozRequestFullScreen) videoTag.mozRequestFullScreen();
      else if (videoTag.webkitRequestFullscreen) videoTag.webkitRequestFullscreen();
      else if (videoTag.msRequestFullscreen) videoTag.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  const toggleMenu = () => setMenu(!menu);
  const toggleVideoRes = () => setVideoRes(!videoRes);

  return (
    <div className={`controls ${showControls ? 'd-block' : 'd-none'}`}>
      <div className="controls-top">
        <div className="left-controls">
          <button className="play-pause-btn" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <span className="video-duration">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="right-controls">
          <div className="volume-controls">
            <input
              type="range"
              className="volume-bar"
              id='volume-bar'
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
            <button className="mute-btn" onClick={handleMute}>
              {isMuted ? <IoVolumeMute /> : handleVolumeIcon(volume)}
            </button>
          </div>
          <button className="fullscreen-btn" onClick={()=>handleFullscreen(videoTag)}>
            {fullscreen ? <MdOutlineFullscreenExit /> : <MdOutlineFullscreen />}
          </button>
          <button className="menu-btn" onClick={toggleMenu}>
            <HiDotsVertical />
          </button>
          {menu && (
            <div className="menu">
              <button className="menu-item" onClick={toggleVideoRes}>
                Quality:{resolution}
              </button>
              {videoRes && (
                <div className="resolution-options">
                  {['-1080p', '-720p', '-480p', '-360p'].map((res) => (
                    <button
                      key={res}
                      value={res}
                      onClick={handleResolutionChange}
                      className={res === resolution ? 'active' : ''}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              )}
              <button className="menu-item" >Download</button>
            </div>
          )}
        </div>
      </div>
      <div className="progress-bar-container">
        <input
          className="progress-bar"
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
        />
      </div>
    </div>
  )
}

export default VideoControls