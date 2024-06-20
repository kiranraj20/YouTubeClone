import React, { useState } from 'react'

const RecordingButton = () => {
  
  const [isRecording, setIsRecording] = useState(false)
  const [recordedData, setRecordedData] = useState([]);
  let mediaRecorder;

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'window' },
      audio: true,
    });
    
    mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
        setRecordedData(chunks);
      }
    };
    mediaRecorder.start();

    mediaRecorder.onstop = () => {
      setIsRecording(true);
    };
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedData, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.mp4';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setIsRecording(false);
  };

  return (
    <div>
      {isRecording &&
        <button onClick={downloadRecording}>Download</button>
      }
      {!isRecording &&
        <button onClick={startRecording}>Start Recording</button>
      }
      
    </div>
  )
}

export default RecordingButton