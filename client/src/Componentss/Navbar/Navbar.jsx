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

const Navbar = () => {
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

    useEffect(() => {
        if (storage?.result?.email) {
            setCurrentUser({ email: storage.result.email });
            dispatch(login({ email: storage.result.email }));
        }
    }, []);

    const selector = useSelector(state => state.authReducer.data);
    useEffect(() => {
        if (selector?.result?.email) {
            setCurrentUser({ email: selector.result.email });
        }
    }, [selector]);

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
        <div className='d-flex flex-column'>
            <div className='Navbar'>
                <div className="logo-container">
                    <Offcanvas className='hamburger' />
                    <div className='logo'>
                        <img className='logo-img' src={logo} alt="logo" />
                        <p className='logo-text'>YouTube</p>
                    </div>
                </div>
                <div className="search-bar-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            className='search-bar-input'
                            placeholder='Search'
                            onChange={e => setSearchQuery(e.target.value)}
                            onClick={() => setSearchList(true)}
                            value={searchQuery}
                        />
                        <Link to={`/search/${searchQuery}`}>
                        <div className='search-bar-icon' onClick={() => setSearchList(false)}>
                            <IoIosSearch />
                        </div>
                        </Link>
                    </div>
                    {searchQuery && searchList && <SearchList titleArray={titleArray} setSearchQuery={setSearchQuery} setSearchList={setSearchList} />}
                    <div className="mic"><MdMic /></div>
                </div>
                <div className="profile-container">
                    <OffcanvasCreate className='profile-create-icon' />
                    <FaRegBell className='profile-bell-icon' />
                    {currentUser.email ? (
                        <div className='d-flex' ref={profileRef}>
                            <div
                                className="profile-user text-nowrap text-small"
                                onClick={() => setProfile(!profile)}
                            >
                                {currentUser.email.charAt(0).toUpperCase()}
                            </div>
                            {profile && (
                                <div className='profile-visible'>
                                    <div className="profile-bar-tab">
                                        <div className="profile-bar-icon">{currentUser.email.charAt(0).toUpperCase()}</div>
                                        <div className="profile-bar-text">{currentUser.email}</div>
                                    </div>
                                    <div className="create-channel-btn" onClick={() => {setChannel(!channel)}}>
                                        <GrChannel /> {selector?.result?.name || storage?.result?.name ? (
                                            <Link to={`/channelpage/${channelID}`} >Edit Channel</Link>
                                        ) : 'Create Channel'}
                                    </div>
                                    {channel && !storage?.result.name && (
                                        <div className='create-channel-tab-visible'>
                                            <CreateChannel channel={channel} setChannel={setChannel} />
                                        </div>
                                    )}
                                    <div className="logout-text" onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='d-flex'>
                            <div className="profile-user text-nowrap" onClick={googleLogin}>
                                <FaRegUser className='me-1' />Sign in
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='d-flex'>
                <Sidebar />
                <AllRoutes />
            </div>
        </div>
    );
};

export default Navbar;
