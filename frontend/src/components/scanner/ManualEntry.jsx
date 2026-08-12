import { useState } from 'react';
import { Barcode, Search } from 'lucide-react';
import Button from '../common/Button';

export default function ManualEntry({ onSubmit, error, onSwitchToCamera }) {
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim()) {
      onSubmit(barcode.trim());
    }
  };

  return (
    <div className="manual-entry-container">
      <div className="manual-entry-card">
        <Barcode size={48} className="manual-icon" />
        <h3>Manual Barcode Entry</h3>
        <p>Type the numbers below the barcode on the product packaging.</p>
        
        <form onSubmit={handleSubmit} className="manual-form">
          <input
            type="text"
            placeholder="e.g. 890100000007"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="manual-input"
            autoFocus
          />
          
          {error && <p className="manual-error-text">{error}</p>}
          
          <Button type="submit" className="manual-submit-btn">
            <Search size={16} /> Lookup Product
          </Button>
        </form>
      </div>

      <div className="scanner-footer">
        <Button 
          variant="secondary" 
          className="scanner-mode-btn"
          onClick={onSwitchToCamera}
        >
          Back to Camera Scanner
        </Button>
      </div>
    </div>
  );
}
