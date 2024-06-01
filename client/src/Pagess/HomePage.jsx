import React from 'react'
import Researchbar from '../Componentss/Research/Researchbar.jsx';
import Videos from '../Componentss/Videos/Videos.jsx';
import { useSelector } from 'react-redux';

const Home = () => {
  const vids = useSelector(state => state.videoReducer?.data);
  return (
    <div className="Sidebar d-flex">
        <div className="">
            <Researchbar />
            <Videos vids={vids} />
        </div>
    </div>
  )
}

export default Home