import React, { useState, useEffect } from 'react';
import './VideoPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import DateConversion from '../../Componentss/DateConversion';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { CgPlayListAdd, CgPlayListCheck  } from "react-icons/cg";
import { RiShareForwardFill } from "react-icons/ri";
import { CiMenuKebab } from "react-icons/ci";
import Comments from '../../Componentss/Comments/Comments';
import { getVideos, updateVideo } from '../../Actions/Video';
import { getChannel, likedVideo, savedVideo } from '../../Actions/channelUser';
import VideoPlayer from '../../Componentss/VideoPlayer/VideoPlayer';

const VideoPage = () => {
  const {videoReducer,channelReducers ,authReducer} = useSelector((state) => state);
  const { Vid: videoId } = useParams();
  const data = videoReducer?.data?.find((item) => item._id === videoId)
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const likeData = channelReducers?.likedVideos;
  const [save, setSave] = useState(false)
  const saveData = channelReducers?.savedVideos;
  const dispatch = useDispatch();
  const userId = authReducer?.data?.result?._id;

  useEffect(() => {
    if (userId) {
      dispatch(getChannel(userId))
    }
  },[userId,dispatch]);

  useEffect(() => {
    if (likeData?.includes(videoId)) {
      setLike(true);
    } 
    if (saveData?.includes(videoId)) {
      setSave(true);
    }
  }, [likeData,videoId,saveData]);


  const handleLike = () => {
    const newLikes = like&&data.Like>=0 ? data.Like - 1 : data.Like + 1;
    dispatch(updateVideo(videoId, { 'Like': newLikes }))
    dispatch(likedVideo(userId,videoId))
    dispatch(getVideos())
    setLike(!like);
  };

  const handleDislike = () => {
    setDislike(!dislike);
  };

  const handleSave = () => {
    setSave(!save);
    dispatch(savedVideo(userId, videoId));
    setTimeout(() => {
      console.log('video has been saved...')
    }, 3000);
  }

  return (
    <div className='video-page-container'>
      <div className="video-page-layout">
        <div className="video-page-video">
          {data && (
            <VideoPlayer
            videoSrc = {`https://null-class-internship-server.vercel.app/${data?.filePath}`}
            videoId={videoId}
            />
          )}
        </div>
        <div className="video-page-profile">
          <div className="d-flex">
            <FaRegUser className='video-page-icon' />
            <div className="video-page-head">
              <div className="video-page-title">{data?.videoTitle}</div>
              <div className="video-page-channel">{data?.uploader}</div>
              <div className="d-flex">
                <div className="video-page-views">{data?.Views} views</div>
                <div className="video-page-timestamp">&#160; • {DateConversion(data?.updatedAt)} days ago</div>
              </div>
            </div>
          </div>
          <div className="video-page-btns">
            <div className="video-page-like-btn" onClick={handleLike}>
              {like ? <AiFillLike /> : <AiOutlineLike />} Like {data?.Like}
            </div>
            <div className="video-page-dislike-btn" onClick={handleDislike}>
              {dislike ? <AiFillDislike /> : <AiOutlineDislike />} Dislike
            </div>
            <div className="video-page-save-btn" onClick={handleSave}>{save ? <CgPlayListCheck /> : <CgPlayListAdd />} Save</div>
            <div className="video-page-share-btn"><RiShareForwardFill /> Share</div>
            <div className="video-page-menu-btn"><CiMenuKebab /></div>
          </div>
        </div>
        <div className="video-page-comments">
          <h5>Comments</h5>
          <Comments videoId={videoId} />
        </div>
      </div>
      <div className="video-suggestions">
        {/* Suggestions content here */}
      </div>
    </div>
  );
};

export default VideoPage;
