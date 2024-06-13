import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoIosSearch } from "react-icons/io";
import { MdMic } from "react-icons/md";
import { FaRegBell, FaRegUser } from "react-icons/fa6";
import { GrChannel } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OffcanvasCreate from '../Offcanvas/OffcanvasCreate';
import Offcanvas from '../Offcanvas/OffcanvasHamburger';
import SearchList from './SearchList';
import CreateChannel from '../../Pagess/CreateChannel/CreateChannel';
import { login, logout } from '../../Actions/auth';
import logo from '../../Utilitiess/Logo/favicon.png';
import "./Navbar.css";
import Sidebar from '../Sidebar/Sidebar';
import AllRoutes from '../AllRoutes';
import { useNavigate } from 'react-router-dom';
import { getHistoryByUserId } from '../../Actions/history';
import { BsCoin } from "react-icons/bs";


const Navbar = ({color}) => {
    const [currentUser, setCurrentUser] = useState({ email: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchList, setSearchList] = useState(false);
    const [profile, setProfile] = useState(false);
    const [channel, setChannel] = useState(false);

    const titleArray = useSelector(s=>s.videoReducer)?.data?.filter(q=>q?.videoTitle.toUpperCase().includes(searchQuery.toUpperCase())).map(m=>m?.videoTitle);

    const dispatch = useDispatch();
    const profileRef = useRef(null);

    const storage = JSON.parse(localStorage.getItem('profile') || '{}');
    const channelID = storage?.result?._id || '';

    const points = useSelector(state=> state?.historyReducer?.data?.watchedVideos?.length)

    useEffect(() => {
        if (storage?.result?.email) {
            setCurrentUser({ email: storage.result.email });
            dispatch(login({ email: storage.result.email }));
        }
    }, [dispatch,storage?.result?.email]);

    const selector = useSelector(state => state.authReducer.data);
    useEffect(() => {
        if (selector?.result?.email) {
            setCurrentUser({ email: selector.result.email });
        }
        if (selector?.result?._id) {
            dispatch(getHistoryByUserId(selector?.result?._id))
        }
    }, [selector, dispatch]);

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            const accessToken = response.access_token;
            const userInfo = await fetchUserInfo(accessToken);
            if (userInfo) {
                dispatch(login({ email: userInfo.email }));
            }
        }
    });

    const fetchUserInfo = useCallback(async (token) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error('Failed to fetch user info', error);
            return null;
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfile(false);
            }
        };
        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();
    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/', { replace: true });
        window.location.reload()
    }
    

    return (
        <div className={`d-flex flex-column ${color && 'dark-mode'}`}>
            <div className={` Navbar ${color && 'dark-mode'}`}>
                <div className="logo-container">
                    <Offcanvas className='hamburger' color={color} />
                    <div className='logo'>
                        <img className='logo-img' src={logo} alt="logo" />
                        <p className='logo-text'>YouTube</p>
                    </div>
                </div>
                <div className="search-bar-container">
                    <div className={`search-bar ${color && 'dark-mode'}`}>
                        <input
                            type="text"
                            className={`search-bar-input ${color && 'dark-mode'}`}
                            placeholder='Search'
                            onChange={e => setSearchQuery(e.target.value)}
                            onClick={() => setSearchList(true)}
                            value={searchQuery}
                        />
                        <Link to={`/search/${searchQuery}`}>
                        <div className={`search-bar-icon ${color && 'dark-mode'}`} onClick={() => setSearchList(false)}>
                            <IoIosSearch />
                        </div>
                        </Link>
                    </div>
                    {searchQuery && searchList && <SearchList color={color} titleArray={titleArray} setSearchQuery={setSearchQuery} setSearchList={setSearchList} />}
                    <div className={`mic ${color && 'dark-mode dark-hover'}`}><MdMic /></div>
                </div>
                <div className="profile-container">
                    <OffcanvasCreate className='profile-create-icon' color={color} />
                    <FaRegBell className={`profile-bell-icon ${color && 'dark-mode dark-hover'}`} />
                    {currentUser.email ? (
                        <div className='d-flex' ref={profileRef}>
                            <div
                                className={`profile-user text-nowrap text-small ${color && 'dark-mode dark-hover'}`}
                                onClick={() => setProfile(!profile)}
                            >
                                {currentUser.email.charAt(0).toUpperCase()}
                            </div>
                            {profile && (
                                <div className= {`profile-visible ${color && 'dark-mode'}`}>
                                    <div className="profile-bar-tab">
                                        <div className="profile-bar-icon">{currentUser.email.charAt(0).toUpperCase()}</div>
                                        <div className="profile-bar-text">{currentUser.email}</div>
                                    </div>
                                        <div className='points-bar'><BsCoin className='text-danger me-2' />Points : {points ? points : '0'}</div>
                                    <div className= {`create-channel-btn ${color && 'dark-mode dark-hover'}`} onClick={() => {setChannel(!channel)}}>
                                        <GrChannel /> {selector?.result?.name || storage?.result?.name ? (
                                            <Link className={` ${color && 'dark-mode'}`} to={`/channelpage/${channelID}`} >
                                                Edit Channel
                                            </Link>
                                        ) : 'Create Channel'}
                                    </div>
                                    {channel && !storage?.result.name && (
                                        <div className= {`create-channel-tab-visible ${color && 'dark-mode dark-hover'}`} >
                                            <CreateChannel channel={channel} setChannel={setChannel} />
                                        </div>
                                    )}
                                    <div className= {`logout-text  ${color && 'dark-mode dark-hover'}`} onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='d-flex'>
                            <div className={`profile-user text-nowrap ${color && 'dark-mode dark-hover'}`} onClick={googleLogin}>
                                <FaRegUser className='me-1' />Sign in
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='d-flex'>
                <Sidebar color={color} />
                <AllRoutes color={color} />
            </div>
        </div>
    );
};

export default Navbar;
