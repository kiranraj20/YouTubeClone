import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import './OffcanvasHamburger.css'
import logo from "../../Utilitiess/Logo/favicon.png";

const Offcanvas = ({color}) => {
  return (
    <div className='button-container'>
        <button className={`button ${color && 'dark-mode dark-hover'}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><RxHamburgerMenu /></button>

        <div className={`offcanvas offcanvas-start ${color && 'dark-mode'}`} data-bs-scroll="true" tabIndex="100" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel" 
        style={{
            width:'20vw',
        }}>
            <div className={`button-container ${color && 'dark-mode'}`} 
            style={{
                margin: '6px 9%',
            display: 'flex'
            }}>
                <button className={`button ${color && 'dark-mode dark-hover'}`} type="button" data-bs-dismiss="offcanvas" aria-label="Close"><RxHamburgerMenu /></button>
                <div className={`logo ${color && 'dark-mode'}`}>
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