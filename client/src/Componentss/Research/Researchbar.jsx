import React from 'react';
import './Researchbar.css';

const Researchbar = ({color}) => {
    const obj = ['All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live'];

    return (
        <div className= {`researchbar-container scrollbar  ${color && 'dark-mode '}`}>
            {obj.map((item, index) => (
                <div className= {`researchbar  ${color && 'dark-mode '}`} key={index}>
                  <div className={`researchbar-elements  ${color && 'dark-mode dark-hover'}`}>{item}</div>
                </div>
            ))}
        </div>
    );
};

export default Researchbar;