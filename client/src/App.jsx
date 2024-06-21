import { useDispatch } from 'react-redux';
import './App.css';
import Navbar from './Componentss/Navbar/Navbar';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getVideos } from './Actions/Video';

function App() {
  const [color, setColor] = useState(false)
  const [state, setState] = useState('TS')
  const [Down , setDown] = useState(false)

  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getVideos());
  }, [dispatch])

  useEffect(() => {
    const currentDate = new Date().getHours();
    if (currentDate >= 10 && currentDate < 12) {
      if (state === 'TS' || state === 'TN' || state === 'AP' || state === 'KA' || state === 'KL') {
        setColor(false);
      }else{
        setColor(true)
      }
    }else{
      setColor(true)
    }
  }, [state]);

  useEffect(()=>{
    const currentDate = new Date().getHours();
    if (currentDate>13 && currentDate < 14) {
      setDown(true)
    }else{
      setDown(false)
    }
  },[])
  
  // const [location, setLocation] = useState(null);
  // // Geocode.setApiKey('YOUR_GOOGLE_MAPS_API_KEY');

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     // setLocation({
  //     //   latitude: position.coords.latitude,
  //     //   longitude: position.coords.longitude,
  //     // });
  //     if (position.coords.latitude && position.coords.longitude) {
  //       console.log(position.coords.latitude, position.coords.longitude)
  //       getStateName(13.0449408, 77.5684096);
  //     }
  //   });
  // }, []);

  // const getStateName = async (latitude, longitude) => {
  //   try {
  //     const response = await Geocode.fromLatLng(latitude, longitude);
  //     if (response.results && response.results[0]) {
  //       const address = response.results[0].formatted_address;
  //       const state = address.split(',')[2].trim();
  //       setLocation(state);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching state name:", error);
  //   }
  // };

  // console.log(location)

  return (
    <BrowserRouter >
      {Down ? <h1>WEBSITE IS UNDER MAINTENANCE FROM 1PM TO 2PM...</h1> : 
      <div className= {` ${color && 'dark-mode'}`}>
        <div className="head">
          <Navbar color={color} setState={setState} />
        </div>
      </div>
      }
    </BrowserRouter>
  );
}

export default App;
