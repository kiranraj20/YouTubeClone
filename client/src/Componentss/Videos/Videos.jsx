import React, { useEffect, useState } from 'react';
import "./Videos.css";
import { FaRegUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import DateConversion from '../DateConversion';

const Videos = ({vids}) => {
    
    const [videoRefs, setVideoRefs] = useState([]);

    useEffect(() => {
        setVideoRefs((vidRefs) =>
            Array(vids?.length)
                .fill()
                .map((_, i) => vidRefs[i] || React.createRef())
        );
    }, [vids?.length]);


    useEffect(() => {
        videoRefs.forEach((videoRef, index) => {
            const videoElement = videoRef.current;
            if (videoElement) {
                const handleMouseEnter = () => {
                    videoElement.play();
                };
                const handleMouseLeave = () => {
                    videoElement.pause();
                };
                videoElement.addEventListener('mouseenter', handleMouseEnter);
                videoElement.addEventListener('mouseleave', handleMouseLeave);
                return () => {
                    videoElement.removeEventListener('mouseenter', handleMouseEnter);
                    videoElement.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        });
    }, [videoRefs]);

    return (
        <div className='videos-container'>
            {vids?.map((item, index) => (
                <div className="videos" key={item._id}>
                    <Link to={`/video/${item._id}`}>
                        <video
                            className='video-video'
                            src={`https://null-class-internship-server.vercel.app/${item.filePath}`}  //  http://localhost:5500/    https://null-class-internship-server.vercel.app/
                            ref={videoRefs[index]}
                            style={{ outline: 'none',objectFit:'cover' }}
                            width={'100%'}
                            height={'100%'}
                            muted
                        ></video>
                    </Link>
                    <div className="video-info d-flex">
                        <div className="video-channel-logo"><FaRegUser /></div>
                        <div className="video-description">
                            <p className="video-title">{item.videoTitle}</p>
                            <p className="video-channel">{item.uploader}</p>
                            <div className="d-flex">
                                <p className="video-views">{item.Views} views</p>
                                <p className="video-timestamp">&#160; • {DateConversion(item.createdAt)} days ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Videos;
