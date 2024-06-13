import React from 'react'
import Researchbar from '../Componentss/Research/Researchbar.jsx';
import Videos from '../Componentss/Videos/Videos.jsx';
import { useSelector } from 'react-redux';

const Home = ({color}) => {
  const vids = useSelector(state => state.videoReducer?.data?.filter((item) => item.filePath[item.filePath.length-5] !== 'p'));
  
  return (
    <div className="Sidebar d-flex">
        <div className="">
            <Researchbar  color={color} />
            <Videos vids={vids} />
        </div>
    </div>
  )
}

export default Home