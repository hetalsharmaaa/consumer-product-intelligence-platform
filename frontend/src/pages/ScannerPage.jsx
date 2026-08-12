import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info } from 'lucide-react';
import { getAllProducts } from '../services/mockData';
import { useScanner } from '../hooks/useScanner';
import CameraView from '../components/scanner/CameraView';
import ManualEntry from '../components/scanner/ManualEntry';
import './ScannerPage.css';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualError, setManualError] = useState(null);
  
  // Use our custom hook for scanner logic
  const scannerHook = useScanner("reader");
  const { stopScanner } = scannerHook;

  // Handler for successful scan from CameraView
  const handleScanSuccess = useCallback((decodedText) => {
    const products = getAllProducts();
    const product = products.find(p => p.barcode === decodedText);
    
    if (product) {
      navigate(`/product/${product.id}`);
    } else {
      // If product not found via camera, force manual mode with error
      setManualError(`Barcode ${decodedText} not found in database.`);
      setIsManualEntry(true);
    }
  }, [navigate]);

  // Handler for manual barcode submission
  const handleManualSubmit = useCallback((barcode) => {
    const product = getAllProducts().find(p => p.barcode === barcode);
    if (product) {
      navigate(`/product/${product.id}`);
    } else {
      setManualError("Product not found. Please try another barcode.");
    }
  }, [navigate]);

  // Handler for closing the scanner completely
  const handleClose = async () => {
    await stopScanner();
    navigate(-1);
  };

  // Mode switching handlers
  const switchToManual = async () => {
    await stopScanner();
    setManualError(null);
    setIsManualEntry(true);
  };

  const switchToCamera = () => {
    setManualError(null);
    setIsManualEntry(false);
  };

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <button className="scanner-close" onClick={handleClose} aria-label="Close scanner">
          <X size={24} />
        </button>
        <h2 className="scanner-title">{isManualEntry ? 'Enter Barcode' : 'Scan Barcode'}</h2>
        <button className="scanner-info-btn" aria-label="Scanner info">
          <Info size={20} />
        </button>
      </div>

      <div className="scanner-viewport">
        {isManualEntry ? (
          <ManualEntry 
            onSubmit={handleManualSubmit} 
            error={manualError}
            onSwitchToCamera={switchToCamera} 
          />
        ) : (
          <CameraView 
            scannerHook={scannerHook}
            onScanSuccess={handleScanSuccess}
            onSwitchToManual={switchToManual}
          />
        )}
      </div>
    </div>
  );
}
