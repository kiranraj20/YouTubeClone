import React from 'react'
import { MdHomeFilled } from "react-icons/md";
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import './Sidebar.css';
import { Link } from 'react-router-dom';




const Sidebar = ({color}) => {
  return (
    <div className='sidebar-container'> 
        <Link to={'/'} className= {`sidebar-home ${color && 'dark-mode dark-hover'}`}>
            <div className="sidebar-home-icon"><MdHomeFilled /></div>
            <div className="sidebar-home-text">Home</div>
        </Link>
        <Link to={'/explore'} className= {`sidebar-explore ${color && 'dark-mode dark-hover'}`}>
            <div className="sidebar-explore-icon"><MdOutlineExplore /></div>
            <div className="sidebar-explore-text">Explore</div>
        </Link>
        <Link to={'/subscriptions'} className= {`sidebar-subscriptions ${color && 'dark-mode dark-hover'}`}>
            <div className="sidebar-subscriptions-icon"><MdOutlineSubscriptions /></div>
            <div className="sidebar-subscriptions-text">Subscriptions</div>
        </Link>
        <Link to={'/library'} className= {`sidebar-library ${color && 'dark-mode dark-hover'}`}> 
            <div className="sidebar-library-icon"><MdOutlineVideoLibrary /></div>
            <div className="sidebar-library-text">Library</div>
        </Link>
    </div>
  )
}

export default Sidebar