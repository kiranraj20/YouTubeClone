import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../Actions/message';
import React, { useCallback, useEffect, useState } from 'react';
import './Call.css'
import { useSocket } from '../../Context/SocketProvider';
import peer from '../../Service/peer';
import ReactPlayer from "react-player";

const Call = () => {

  const sender = useSelector(state => state?.authReducer?.data?.result);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [roomId, setRoomId] = useState(sender?.messages[sender?.messages.length - 1]?.message || '');
  const [call, setCall] = useState(false);
  const dispatch = useDispatch();
  const socket = useSocket();

  const handleRoomId = useCallback(() => {
    const getRandomHexDigit = () => {
      const characters = '0123456789abcdef';
      return characters[Math.floor(Math.random() * characters.length)];
    };
    const generateRandomHexCode = () => {
      let hexCode = '';
      for (let i = 0; i < 18; i++) {
        hexCode += getRandomHexDigit();
      }
      return hexCode;
    };
    const code = generateRandomHexCode()
    setRoomId(code);
  },[])

  const handleCall = useCallback((event) => {
    event.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    dispatch(sendMessage({from: sender?.email, to: email, message: roomId}));
    setCall(true);
  },[dispatch,sender?.email,email,roomId]);

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      const from = sender?.email;
      socket.emit("room:join", { email:from, room:roomId });
      setCall(true);
    },
    [roomId, sender?.email, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
    },
    []
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
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

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
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
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className='call-container'>
      {!call ? (
        <>
          <div className='call-f'>
            <input
              className='call-i'
              type="email"
              value={email}
              placeholder="Enter Gmail"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
            <button className='call-b1' onClick={handleRoomId}>Generate Room Id</button>
            <input
              className='call-i'
              type='text'
              value={roomId}
              placeholder='roomId'
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button type='submit' className='call-b2' onClick={handleCall}>Call</button>
            <p>Messages {sender?.messages[sender?.messages.length - 1]?.message}</p>
          </div>
          <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
              <label htmlFor="room">Room Number</label>
              <input
                type="text"
                id="room"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <br />
              <button>Join</button>
            </form>
          </div>
        </>
      ) : (
        <div>
          <div className="d-flex justify-content-between">
            <h3>Room</h3>
            <div className='call-close-btn' onClick={() => setCall(false)}>x</div>
          </div>
          <div>
            <h6>Status : {remoteSocketId ? "Connected" : "No one in room"}</h6>
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
            {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
            {myStream && (
              <>
                <h6>You</h6>
                <ReactPlayer
                  playing
                  muted
                  height="30%"
                  width="100%"
                  url={myStream}
                />
              </>
            )}
            <div className='call-record-btn'>Record</div>
            {remoteStream && (
              <>
                <h6>Others</h6>
                <ReactPlayer
                  playing
                  muted
                  height="30%"
                  width="100%"
                  url={remoteStream}
                />
              </>
            )}
          </div>
          <button className='call-end-btn' onClick={()=>window.location.reload()}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default Call;
