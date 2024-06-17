import React, { useState, useEffect, useRef } from 'react';
import './Location.css';

const states = [
  { name: 'Andhra Pradesh', initials: 'AP' },
  { name: 'Arunachal Pradesh', initials: 'AR' },
  { name: 'Assam', initials: 'AS' },
  { name: 'Bihar', initials: 'BR' },
  { name: 'Chhattisgarh', initials: 'CG' },
  { name: 'Goa', initials: 'GA' },
  { name: 'Gujarat', initials: 'GJ' },
  { name: 'Haryana', initials: 'HR' },
  { name: 'Himachal Pradesh', initials: 'HP' },
  { name: 'Jharkhand', initials: 'JH' },
  { name: 'Karnataka', initials: 'KA' },
  { name: 'Kerala', initials: 'KL' },
  { name: 'Madhya Pradesh', initials: 'MP' },
  { name: 'Maharashtra', initials: 'MH' },
  { name: 'Manipur', initials: 'MN' },
  { name: 'Meghalaya', initials: 'ML' },
  { name: 'Mizoram', initials: 'MZ' },
  { name: 'Nagaland', initials: 'NL' },
  { name: 'Odisha', initials: 'OR' },
  { name: 'Punjab', initials: 'PB' },
  { name: 'Rajasthan', initials: 'RJ' },
  { name: 'Sikkim', initials: 'SK' },
  { name: 'Tamil Nadu', initials: 'TN' },
  { name: 'Telangana', initials: 'TS' },
  { name: 'Tripura', initials: 'TR' },
  { name: 'Uttar Pradesh', initials: 'UP' },
  { name: 'Uttarakhand', initials: 'UK' },
  { name: 'West Bengal', initials: 'WB' },
];

const Location = ({setState, color}) => {
  const [selectedState, setSelectedState] = useState('TS');
  const [locationMenu, setLocationMenu] = useState(false);
  const menuRef = useRef(null);

  const handleSelect = (state) => {
    const stateInitials = state;
    setSelectedState(stateInitials);
    setLocationMenu(false); 
    setState(stateInitials);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setLocationMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`location-container ${color && ''}`}>
      <div
        className={`location-menu-bar ${color && ''}`}
        onClick={() => setLocationMenu(!locationMenu)}
        value={selectedState}
      >
        <div className={`location ${color ? 'bg-transparent dark-hover' : 'location-hover'}`}>{selectedState}</div>
        {locationMenu && (
          <div className={`location-menu ${color ? 'dark-mode' : 'bg-light'}`} ref={menuRef}>
            {states.map((state) => (
              <div
              className={`location-options ${color ? ' dark-hover' : 'location-options-hover'}`}
                onClick={() => handleSelect(state.initials)}
                key={state.initials}
                value={state.initials}
              >
                <div className={`${color && 'dark-hove'}`}>
                  {state.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;
