import { useState, useRef, useEffect, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import Result from './results';
import Scanner from './scanner'

const CameraComponent = () => {
    // const [scanning, setScanning] = useState(false); // toggleable state for "should render scanner"
    const [cameras, setCameras] = useState([]); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
    const [cameraId, setCameraId] = useState(null); // id of the active camera device
    const [cameraError, setCameraError] = useState(null); // error message from failing to access the camera
    const [results, setResults] = useState([]); // list of scanned results
    const scannerRef = useRef(null); // reference to the scanner element in the DOM

    useEffect(() => {
        // Define async functions
        const enableCamera = async () => {
            await Quagga.CameraAccess.request(null, {});
        };
    
        const disableCamera = async () => {
            await Quagga.CameraAccess.release();
        };
    
        const enumerateCameras = async () => {
            const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
            console.log('Cameras Detected: ', cameras);
            return cameras;
        };
    
        // Initialize camera
        const initializeCamera = async () => {
            try {
                await enableCamera();
                await disableCamera();
                const cameras = await enumerateCameras();
                setCameras(cameras);
                Quagga.CameraAccess.disableTorch(); // Disable torch at start
            } catch (err) {
                setCameraError(err); // Handle errors
            }
        };
    
        // Call the initialization function
        initializeCamera();
    
        // Cleanup function
        return () => {
            disableCamera().catch((err) => {
                console.error('Failed to release camera during cleanup:', err);
            });
        };
    }, []);

    return (
        <div>
            {cameraError ? <p>ERROR INITIALIZING CAMERA ${JSON.stringify(cameraError)} -- DO YOU HAVE PERMISSION?</p> : null}
            {cameras.length === 0 ? <p>Enumerating Cameras, browser may be prompting for permissions beforehand</p> :
                <form style={{ paddingBottom: '5px' }}>
                    <select onChange={(event) => setCameraId(event.target.value)}>
                        {cameras.map((camera) => (
                            <option key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || camera.deviceId}
                            </option>
                        ))}
                    </select>
                </form>
            }
            {/* <button onClick={() => setScanning(!scanning) }>{scanning ? 'Stop' : 'Start'}</button> */}
            <ul className="results">
                {results.map((result) => (result.codeResult && <Result key={result.codeResult.code} result={result} />))}
            </ul>
            <div ref={scannerRef} style={{position: 'relative', border: '0px solid red'}}>
                <canvas className="drawingBuffer" style={{
                    position: 'absolute',
                    top: '0px',
                    border: '0px solid green',
                }} width="300" height="20" />
                {<Scanner scannerRef={scannerRef} cameraId={cameraId} onDetected={(result) => setResults([...results, result])} /> }
            </div>
        </div>
    );
};

export default CameraComponent;