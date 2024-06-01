import { useDispatch } from 'react-redux';
import './App.css';
import AllRoutes from './Componentss/AllRoutes';
import Navbar from './Componentss/Navbar/Navbar';
import Researchbar from './Componentss/Research/Researchbar';
import Home from './Pagess/HomePage';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { getVideos } from './Actions/Video';
import { fetchAllChannels } from './Actions/channelUser';

function App() {

  const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch])

  return (
    <BrowserRouter >
      <div className="App">
        <div className="head">
          <Navbar/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
