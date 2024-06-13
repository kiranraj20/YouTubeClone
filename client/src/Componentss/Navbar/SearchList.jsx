import React from 'react'
import './SearchList.css'

const SearchList = ({titleArray,setSearchQuery,setSearchList, color}) => {
  return (
    titleArray.map(m => {
      return (
        <div key={m} className= {`search-list-container  ${color && 'dark-mode  '}`}>
          <p onClick={e=>{setSearchQuery(m);setSearchList(false)}} className= {`search-element  ${color && 'dark-mode dark-hover'}`}>{m}</p>
        </div>
      )
    })
  )
};

export default SearchList