import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Videos from "../../Componentss/Videos/Videos";
// import vid from "../../components/Video/vid.mp4";
// import "./Search.css";
function Search () {
  const {searchQuery} = useParams();
  const vids = useSelector((state) => state.videoReducer)
    ?.data?.filter((q) => q?.videoTitle.toUpperCase().includes(searchQuery.toUpperCase()))
    .reverse();
    console.log('vids',vids)
  return (
    <div className="container_Pages_App">
      <div className="container2_Pages_App">
        <Videos vids={vids} />
      </div>
    </div>
  );
}

export default Search;