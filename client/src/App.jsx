import { useDispatch } from 'react-redux';
import './App.css';
import Navbar from './Componentss/Navbar/Navbar';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { getVideos } from './Actions/Video';

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
