import React from 'react';
import './Researchbar.css';

const Researchbar = () => {
    const obj = ['All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live','All', 'Gaming', 'Music', 'Live'];

    return (
        <div className='researchbar-container scrollbar'>
            {obj.map((item, index) => (
                <div className='researchbar' key={index}>
                  <div className="researchbar-elements">{item}</div>
                </div>
            ))}
        </div>
    );
};

export default Researchbar;