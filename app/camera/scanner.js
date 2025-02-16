import { useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Quagga from '@ericblade/quagga2';
import { useRouter } from "next/navigation";

function getMedian(arr) {
    const newArr = [...arr]; // copy the array before sorting, otherwise it mutates the array passed in, which is generally undesireable
    newArr.sort((a, b) => a - b);
    const half = Math.floor(newArr.length / 2);
    if (newArr.length % 2 === 1) {
        return newArr[half];
    }
    return (newArr[half - 1] + newArr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
    const errors = decodedCodes.flatMap(x => x.error);
    const medianOfErrors = getMedian(errors);
    return medianOfErrors;
}

const defaultConstraints = {
    width: 20, 
    height: 20, 
};

const defaultLocatorSettings = {
    patchSize: 'medium',
    halfSample: true,
    willReadFrequently: true,
};

const defaultDecoders = ["ean_reader", "code_128_reader", "code_39_reader"];

const Scanner = ({
    onDetected,
    scannerRef,
    onScannerReady,
    cameraId,
    facingMode,
    constraints = defaultConstraints,
    locator = defaultLocatorSettings,
    decoders = defaultDecoders,
    locate = true,
}) => {
    const router = useRouter();

    const scanSuccess = useCallback(async (barcode) => {
        try {
            // Send the barcode to an API endpoint
            // const url = "/api/product-info?barcode="+barcode;
            // const response = await fetch(url);
            router.replace("293847");
    
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    }, [router]);

    const errorCheck = useCallback((result) => {
        if (!onDetected) {
            return;
        }
        const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
        // if Quagga is at least 75% certain that it read correctly, then accept the code.
        if (err < 0.25) {
            onDetected(result.codeResult.code);
            scanSuccess(result.codeResult.code);
        }
    }, [onDetected, scanSuccess]);

    const handleProcessed = (result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;
        drawingCtx.font = "24px Arial";
        drawingCtx.fillStyle = 'green';

        if (result) {
            // console.warn('* quagga onProcessed', result);
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
                result.boxes.filter((box) => box !== result.box).forEach((box) => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'purple', lineWidth: 2 });
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: 'blue', lineWidth: 2 });
            }
            if (result.codeResult && result.codeResult.code) {
                drawingCtx.font = "24px Arial";
                drawingCtx.fillText(result.codeResult.code, 10, 20);
            }
        }
    };

    useLayoutEffect(() => {
        let ignoreStart = false;
        const init = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            if (ignoreStart) {
                return;
            }
            await Quagga.init({
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        ...constraints,
                        ...(cameraId && { deviceId: cameraId }),
                        ...(!cameraId && { facingMode }),
                    },
                    target: scannerRef.current,
                    willReadFrequently: true,
                },
                locator,
                decoder: { readers: decoders },
                locate,
            }, async (err) => {
                Quagga.onProcessed(handleProcessed);

                if (err) {
                    return console.error('Error starting Quagga:', err);
                }
                if (scannerRef && scannerRef.current) {
                    await Quagga.start();
                    if (onScannerReady) {
                        onScannerReady();
                    }
                }
            });
            Quagga.onDetected(errorCheck);
        };
        init();
        return () => {
            ignoreStart = true;
            Quagga.stop();
            Quagga.offDetected(errorCheck);
            Quagga.offProcessed(handleProcessed);
        };
    }, [cameraId, onDetected, onScannerReady, scannerRef, errorCheck, constraints, locator, decoders, locate, facingMode]);
    return null;
}

Scanner.propTypes = {
    onDetected: PropTypes.func.isRequired,
    scannerRef: PropTypes.object.isRequired,
    onScannerReady: PropTypes.func,
    cameraId: PropTypes.string,
    facingMode: PropTypes.string,
    constraints: PropTypes.object,
    locator: PropTypes.object,
    decoders: PropTypes.array,
    locate: PropTypes.bool,
};

export default Scanner;