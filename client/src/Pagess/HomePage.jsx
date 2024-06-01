import React from 'react'
import Sidebar from 'C:/Users/uset/OneDrive/Desktop/Assesments/NullClassInternship/youtube-clone/src/Componentss/Sidebar/Sidebar.jsx';
import Researchbar from 'C:/Users/uset/OneDrive/Desktop/Assesments/NullClassInternship/youtube-clone/src/Componentss/Research/Researchbar.jsx';
import Videos from 'C:/Users/uset/OneDrive/Desktop/Assesments/NullClassInternship/youtube-clone/src/Componentss/Videos/Videos.jsx';
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