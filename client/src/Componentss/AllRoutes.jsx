import Channel from "../Pagess/CreateChannel/Channel";
import { Routes, Route } from "react-router-dom";
import Home from "../Pagess/HomePage";
import VideoPage from "../Pagess/VideoPage/VideoPage";
import Explore from "./Explore/Explore";
import Subscriptions from "./Subscriptions/Subscriptions";
import Library from "./Library/Library";
import Search from '../Pagess/Search/Search'

function AllRoutes(){
  return(
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/explore' element={<Explore/>} />
      <Route path='/subscriptions' element={<Subscriptions/>} />
      <Route path='/library' element={<Library/>} />
      <Route path='/channelpage/:Cid' element={<Channel/>} />
      <Route path='/video/:Vid' element={<VideoPage />} />
      <Route path='/search/:searchQuery' element={<Search />} />
    </Routes>
  )
}

export default AllRoutes;