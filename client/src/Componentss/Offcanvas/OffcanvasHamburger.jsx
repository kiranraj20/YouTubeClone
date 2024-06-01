import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import './OffcanvasHamburger.css'
import logo from "C:/Users/uset/OneDrive/Desktop/Assesments/NullClassInternship/youtube-clone/src/Utilitiess/Logo/favicon.png";

const Offcanvas = () => {
  return (
    <div className='button-container'>
        <button className="button " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><RxHamburgerMenu /></button>

        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="100" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel" 
        style={{
            width:'20vw',
        }}>
            <div className="" 
            style={{
                margin: '6px 9%',
            display: 'flex'
            }}>
                <button type="button" className="button" data-bs-dismiss="offcanvas" aria-label="Close"><RxHamburgerMenu /></button>
                <div className='logo'>
                    <img className='logo-img' src={logo} alt="logo" />
                    <p className='logo-text'>YouTube</p>
            </div>
            </div>
            <div className="offcanvas-body">
                <p>Try scrolling the rest of the page to see this option in action.</p>
            </div>
        </div>
    </div>
  )
}

export default Offcanvas