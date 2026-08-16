import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Info } from 'lucide-react';
import { productService } from '../services/api/productService';
import { useScanner } from '../hooks/useScanner';
import CameraView from '../components/scanner/CameraView';
import ManualEntry from '../components/scanner/ManualEntry';
import './ScannerPage.css';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualError, setManualError] = useState(null);
  const scannerHook = useScanner('reader');
  const { stopScanner } = scannerHook;

  const lookup = useCallback((barcode) => {
    setManualError(null);
    productService.getProductByBarcode(barcode)
      .then(product => navigate(`/product/${product.id}`))
      .catch(() => { setManualError(`Barcode ${barcode} not found in database.`); setIsManualEntry(true); });
  }, [navigate]);

  const handleClose = async () => { await stopScanner(); navigate(-1); };
  const switchToManual = async () => { await stopScanner(); setManualError(null); setIsManualEntry(true); };
  const switchToCamera = () => { setManualError(null); setIsManualEntry(false); };

  return <div className="scanner-page">
    <div className="scanner-header">
      <button className="scanner-close" onClick={handleClose} aria-label="Close scanner"><X size={24}/></button>
      <h2 className="scanner-title">{isManualEntry ? 'Enter Barcode' : 'Scan Barcode'}</h2>
      <button className="scanner-info-btn" aria-label="Scanner info"><Info size={20}/></button>
    </div>
    <div className="scanner-viewport">
      {isManualEntry
        ? <ManualEntry onSubmit={lookup} error={manualError} onSwitchToCamera={switchToCamera}/>
        : <CameraView scannerHook={scannerHook} onScanSuccess={lookup} onSwitchToManual={switchToManual}/>}
    </div>
  </div>;
}
