import React from 'react'
import './SearchList.css'

const SearchList = ({titleArray,setSearchQuery,setSearchList}) => {
  return (
    titleArray.map(m => {
      return (
        <div key={m} className='search-list-container'>
          <p onClick={e=>{setSearchQuery(m);setSearchList(false)}} className='search-element'>{m}</p>
        </div>
      )
    })
  )
};

export default SearchList