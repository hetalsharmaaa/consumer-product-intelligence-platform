import { useEffect } from 'react';
import { Camera, AlertCircle, Loader } from 'lucide-react';
import Button from '../common/Button';

export default function CameraView({ 
  onScanSuccess, 
  scannerHook, 
  onSwitchToManual 
}) {
  const { 
    isScanning, 
    error, 
    hasCameraPermission, 
    startScanner 
  } = scannerHook;

  // Start the scanner automatically when this component mounts
  useEffect(() => {
    let mounted = true;
    
    // Slight delay to ensure DOM element is ready
    const timer = setTimeout(() => {
      if (mounted) {
        startScanner(onScanSuccess);
      }
    }, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [startScanner, onScanSuccess]);

  return (
    <div className="scanner-camera-container">
      {/* The HTML5 QR Code library injects video here */}
      <div id="reader" className="html5-qrcode-reader"></div>

      {/* Overlays */}
      {!isScanning && (
        <div className="scanner-overlay-message">
          {error ? (
            <div className="scanner-error-state">
              <AlertCircle size={48} className="error-icon" />
              <h3>Camera Error</h3>
              <p>{error}</p>
              <Button onClick={() => startScanner(onScanSuccess)}>Try Again</Button>
            </div>
          ) : hasCameraPermission === false ? (
            <div className="scanner-permission-state">
              <Camera size={48} className="permission-icon" />
              <h3>Camera Access Required</h3>
              <p>Please allow camera permissions to scan barcodes automatically.</p>
              <Button onClick={() => startScanner(onScanSuccess)}>Request Permission</Button>
            </div>
          ) : (
            <div className="scanner-loading-state">
              <Loader size={32} className="spinner" />
              <p>Initializing camera...</p>
            </div>
          )}
        </div>
      )}

      {/* Frame guide (only shown when scanning) */}
      {isScanning && (
        <div className="scanner-frame-guide">
          <div className="scanner-corner top-left"></div>
          <div className="scanner-corner top-right"></div>
          <div className="scanner-corner bottom-left"></div>
          <div className="scanner-corner bottom-right"></div>
          <div className="scanner-laser"></div>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="scanner-footer">
        <p className="scanner-instructions">
          Align the barcode within the highlighted frame. It will scan automatically.
        </p>
        <Button 
          variant="secondary" 
          className="scanner-mode-btn"
          onClick={onSwitchToManual}
        >
          Enter Barcode Manually
        </Button>
      </div>
    </div>
  );
}
