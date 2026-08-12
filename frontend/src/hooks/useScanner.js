import { useState, useEffect, useCallback, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export function useScanner(elementId) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const scannerRef = useRef(null);

  // Stop the scanner and cleanup
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      } finally {
        setIsScanning(false);
      }
    }
  }, [isScanning]);

  // Start the scanner
  const startScanner = useCallback(async (onScanSuccess) => {
    if (isScanning || !elementId) return;

    try {
      // Check for camera permissions
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
        setError('No cameras found on device.');
        return;
      }

      const html5QrCode = new Html5Qrcode(elementId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
        ]
      });

      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Prefer back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          stopScanner().then(() => {
            onScanSuccess(decodedText);
          });
        },
        (errorMessage) => {
          // Ignore routine read errors
        }
      );
      
      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setHasCameraPermission(false);
      setError('Camera permission denied or camera not available.');
      setIsScanning(false);
    }
  }, [elementId, isScanning, stopScanner]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return {
    isScanning,
    error,
    hasCameraPermission,
    startScanner,
    stopScanner
  };
}
