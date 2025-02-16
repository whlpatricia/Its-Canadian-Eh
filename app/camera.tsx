"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import Scanner from './scanner';

interface Camera {
  deviceId: string;
  label: string;
}

interface Result {
  code: string;
  timestamp: number;
}

const CameraComponent: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false); // toggleable state for "should render scanner"
  const [cameras, setCameras] = useState<Camera[]>([]); // array of available cameras
  const [cameraId, setCameraId] = useState<string | null>(null); // id of the active camera device
  const [cameraError, setCameraError] = useState<Error | null>(null); // error message from failing to access the camera
  const [results, setResults] = useState<Result[]>([]); // list of scanned results
  const [torchOn, setTorch] = useState<boolean>(false); // toggleable state for "should torch be on"
  const scannerRef = useRef<HTMLDivElement | null>(null); // reference to the scanner element in the DOM

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {
        width: 20, // Set width
        height: 30, // Set height
        facingMode: "environment", // Use rear camera if available
      });
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log('Cameras Detected: ', cameras);
      setCameras(cameras);
    };

    const initialize = async () => {
      try {
        await enableCamera();
        await disableCamera();
        await enumerateCameras();
        await Quagga.CameraAccess.disableTorch(); // Disable torch at start
      } catch (err) {
        setCameraError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    initialize();

  }, []);

  // const onTorchClick = useCallback(() => {
  //   const torch = !torchOn;
  //   setTorch(torch);
  //   if (torch) {
  //     Quagga.CameraAccess.enableTorch();
  //   } else {
  //     Quagga.CameraAccess.disableTorch();
  //   }
  // }, [torchOn]);

  return (
    <div>
      {cameraError ? <p>ERROR INITIALIZING CAMERA {JSON.stringify(cameraError)} -- DO YOU HAVE PERMISSION?</p> : null}
      {cameras.length === 0 ? <p>Enumerating Cameras, browser may be prompting for permissions beforehand</p> :
        <form>
          <select onChange={(event) => setCameraId(event.target.value)}>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || camera.deviceId}
              </option>
            ))}
          </select>
        </form>
      }
      {/* <button onClick={onTorchClick}>{torchOn ? 'Disable Torch' : 'Enable Torch'}</button>
      <button onClick={() => setScanning(!scanning)}>{scanning ? 'Stop' : 'Start'}</button> */}
      <div ref={scannerRef} style={{ position: 'relative', border: '3px solid red' }}>
        <canvas className="drawingBuffer" style={{
          position: 'absolute',
          top: '0px',
          border: '3px solid green',
        }} />
        {/* {<Scanner scannerRef={scannerRef} cameraId={cameraId} onDetected={(result: Result) => setResults([...results, result])} />} */}
      </div>
    </div>
  );
};

export default CameraComponent;
