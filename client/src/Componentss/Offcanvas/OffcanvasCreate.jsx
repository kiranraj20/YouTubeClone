import React from 'react'
import { BiSolidVideoPlus } from "react-icons/bi";
import { RiVideoUploadLine } from "react-icons/ri";
import { BsSoundwave } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import './OffcanvasCreate.css'





const OffcanvasCreate = ({color}) => {
  return (
    <div className='create-container'>
        <button className={`button ${color && 'dark-mode dark-hover'}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><BiSolidVideoPlus /></button>

        <div className={`offcanvas offcanvas-end ${color && 'dark-mode'}`} id="offcanvasRight" aria-labelledby="offcanvasRightLabel" 
        style={{
            width:'15vw',
            margin: '45px 0px',
            borderTopLeftRadius: '15px',
            borderBottomLeftRadius: '15px',
            height:'130px'
        }}>
            <div className="" 
            style={{
                margin: '0px 0px',
                display: 'flex'
            }}>
                {/* <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
            </div>
            <div className="offcanvas-body" style={{padding:'5px 0px', marginTop:'6px'}}>
                <div className={`upload-video d-flex justify-content-start align-items-center ${color && 'dark-mode dark-hover'}`}>
                    <p style={{margin:'2px', padding:'0px 10px'}}><RiVideoUploadLine  /></p>
                    <p style={{fontSize:'small', margin:'8px'}}>Upload video</p>
                </div>
                <div className={`go-live d-flex justify-content-start align-items-center ${color && 'dark-mode dark-hover'}`}>
                    <p style={{margin:'2px', padding:'0px 10px'}}><BsSoundwave /></p>
                    <p style={{fontSize:'small', margin:'8px'}}>Go live</p>
                </div>
                <div className={`create-post d-flex justify-content-start align-items-center ${color && 'dark-mode dark-hover'}`}>
                    <p style={{margin:'2px', padding:'0px 10px'}}><IoCreateOutline /></p>
                    <p style={{fontSize:'small', margin:'8px'}}>Create post</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OffcanvasCreate