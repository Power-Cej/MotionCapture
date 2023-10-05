import React, { useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing the camera:', err);
    }
  };

  useEffect(() => {
    startCamera()
  }, [])

  const takePicture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageData = canvasRef.current.toDataURL('image/jpeg');

    fetch('http://localhost:5000/myServer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error('Error uploading picture:', error));
  };

  return (
    <div>
      <h1>React Camera</h1>
      <div className="line"></div>
      <video ref={videoRef} width="640" height="480" autoPlay />
      <div>
        {/* <button onClick={startCamera}>Start Camera</button> */}
        <button onClick={takePicture}>Take Picture</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
    </div>
  );
};

export default App;