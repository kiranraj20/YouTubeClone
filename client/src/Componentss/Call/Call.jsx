import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../Actions/message';
import { useSocket } from '../../Context/SocketProvider';
import peer from '../../Service/peer';
import ReactPlayer from "react-player";
import './Call.css';
import RecordingButton from '../RecordingButton/RecordingButton';

const Call = () => {
  const sender = useSelector(state => state?.authReducer?.data?.result);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [roomId, setRoomId] = useState(sender?.messages[sender?.messages.length - 1]?.message || '');
  const [call, setCall] = useState(false);
  const dispatch = useDispatch();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [screenStream, setScreenStream] = useState();
  const [incomingScreenStream, setIncomingScreenStream] = useState(null);
  const [screenTrackSender, setScreenTrackSender] = useState(null);

  const handleRoomId = useCallback(() => {
    const getRandomHexDigit = () => '0123456789abcdef'[Math.floor(Math.random() * 16)];
    const generateRandomHexCode = () => Array.from({ length: 18 }).map(getRandomHexDigit).join('');
    setRoomId(generateRandomHexCode());
  }, []);

  const handleCall = useCallback((event) => {
    event.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    dispatch(sendMessage({ from: sender?.email, to: email, message: roomId }));
    setCall(true);
  }, [dispatch, sender?.email, email, roomId]);

  const handleSubmitForm = useCallback(
    (e) => {
      if(!roomId){
        alert('please enter room id')
      }else{
        e.preventDefault();
        socket.emit("room:join", { email: sender?.email, room: roomId });
        setCall(true);
      }
    },
    [roomId, sender?.email, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {},
    []
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const offer = await peer.getOffer();
      if (socket.connected) {
        socket.emit("user:call", { to: remoteSocketId, offer });
      } else {
        console.error("Socket not connected");
      }
    } catch (error) {
      console.error("Error calling user:", error);
    }
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      try {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        console.log(`Incoming Call`, from, offer);
        const ans = await peer.getAnswer(offer);
        if (socket.connected) {
          socket.emit("call:accepted", { to: from, ans });
        } else {
          console.error("Socket not connected");
        }
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      if (!peer.peer.getSenders().find(sender => sender.track === track)) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const sendScreenStreams = useCallback(() => {
    for (const track of screenStream.getTracks()) {
      if (!peer.peer.getSenders().find(sender => sender.track === track)) {
        peer.peer.addTrack(track, screenStream);
      }
    }
  }, [screenStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setRemoteDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setRemoteDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
  ]);

  const handleScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setScreenStream(screenStream);
      socket.emit("screen:share", { to: remoteSocketId });
  
      const screenTrack = screenStream.getVideoTracks()[0];
      const existingSender = peer.peer.getSenders().find(sender => sender.track.kind === screenTrack.kind);
  
      if (existingSender && existingSender.track.id === screenTrack.id) {
        existingSender.replaceTrack(screenTrack);
        setScreenTrackSender(existingSender);
      } else if (!existingSender) {
        const newSender = peer.peer.addTrack(screenTrack, screenStream);
        setScreenTrackSender(newSender);
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }, [remoteSocketId, socket]);

  const handleStopScreenShare = useCallback(() => {
    if (screenTrackSender) {
      screenTrackSender.replaceTrack(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      socket.emit("screen:stop", { to: remoteSocketId });
    }
  }, [screenStream, screenTrackSender, remoteSocketId, socket]);

  useEffect(() => {
    if (screenStream) {
      sendScreenStreams();
    }
  }, [screenStream, sendScreenStreams]);

  useEffect(() => {
    const handleIncomingScreenStream = (ev) => {
      const screenStream = ev.streams[0];
      console.log('Incoming Screen Stream')
      setIncomingScreenStream(screenStream);
    };

    socket.on("screen:share", () => {
      console.log("Screen sharing started");
      peer.peer.addEventListener("track", handleIncomingScreenStream);
    });

    socket.on("screen:stop", () => {
      console.log("Screen sharing stopped");
      setIncomingScreenStream(null);
    });

    return () => {
      socket.off("screen:share");
      socket.off("screen:stop");
      peer.peer.removeEventListener("track", handleIncomingScreenStream);
    };
  }, [socket]);

  return (
    <div className='call-box '>
      {!call && (
        <div className="call-container">
          <form className="call-f" onSubmit={handleSubmitForm}>
            <h2>Video Call</h2>
            <label>Enter Room Id: </label>
            <input
            className='call-i'
              type="text"
              placeholder='Enter or Create Room Id'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button type="submit">Join</button>
          </form>
          <button onClick={handleRoomId}>Create Room ID</button>
          <form className="call-f" onSubmit={handleCall}>
            <label>Enter Email Id: </label>
            <input
            className='call-i'
              type="email"
              placeholder='Email to Send Room Id'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
            <button type="submit">Send</button>
          </form>
          {sender?.messages[sender?.messages?.length-1]?.message && <div>
            messages : {sender?.messages[sender?.messages?.length-1]?.message}
          </div>}
        </div>
      )}
      {call && (
        <div className='call-container'>
          <button onClick={handleCallUser}>CALL</button>
          <button onClick={handleScreenShare}>SHARE SCREEN</button>
          <button onClick={handleStopScreenShare}>STOP SCREEN</button>
          <RecordingButton />
          <div className="video-container">
            {myStream && (
              <div className="">
                <h3>My Stream</h3>
                <ReactPlayer
                  url={myStream}
                  playing
                  muted
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            {remoteStream && (
              <div className="">
                <h3>Remote Stream</h3>
                <ReactPlayer
                  url={remoteStream}
                  playing
                  muted
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            {incomingScreenStream && (
              <div className="">
                <h3>Incoming Screen Stream</h3>
                <ReactPlayer
                  url={incomingScreenStream}
                  playing
                  muted
                  height="100%"
                  width="100%"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Call;
