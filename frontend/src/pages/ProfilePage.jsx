import { useState } from 'react';
import { User, Mail, Shield, Bell, Settings, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock form state
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@example.com',
    skinType: 'Dry',
    concerns: 'Anti-aging, Hydration',
    notifications: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, this would call an API to update the user profile
  };

  return (
    <div className="profile-page page-enter">
      <div className="profile-header">
        <h1 className="page-title">
          <User size={28} className="title-icon text-accent" />
          My Profile
        </h1>
        <p className="page-subtitle">Manage your account settings and personal preferences.</p>
      </div>

      <div className="profile-content slide-up">
        <div className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              {formData.name.charAt(0)}
            </div>
            <h3 className="profile-name">{formData.name}</h3>
            <p className="profile-email">{formData.email}</p>
            <Badge variant="success" className="profile-badge">Pro Member</Badge>
          </div>

          <nav className="profile-nav">
            <button 
              className={`profile-nav-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <Settings size={18} />
              <span>General Settings</span>
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Shield size={18} />
              <span>Personalization</span>
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <div className="profile-nav-divider"></div>
            <button className="profile-nav-item text-error" onClick={logout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === 'general' && (
            <div className="profile-section">
              <div className="profile-section-header">
                <h2>General Information</h2>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>Save Changes</Button>
                  </div>
                )}
              </div>

              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled={!isEditing}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="profile-security-section">
                <h3>Security</h3>
                <div className="security-item">
                  <div className="security-info">
                    <strong>Password</strong>
                    <p>Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">Update Password</Button>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <strong>Two-Factor Authentication</strong>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-section">
              <h2>Personalization Preferences</h2>
              <p className="text-muted mb-6">These settings help our AI recommend better products for you.</p>
              
              <div className="form-group mb-6">
                <label>Skin Type</label>
                <select 
                  className="form-control" 
                  value={formData.skinType}
                  onChange={(e) => setFormData({...formData, skinType: e.target.value})}
                >
                  <option>Dry</option>
                  <option>Oily</option>
                  <option>Combination</option>
                  <option>Normal</option>
                  <option>Sensitive</option>
                </select>
              </div>
              
              <div className="form-group mb-6">
                <label>Primary Concerns</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.concerns}
                  onChange={(e) => setFormData({...formData, concerns: e.target.value})}
                  placeholder="e.g. Acne, Wrinkles, Redness"
                />
              </div>
              
              <Button variant="primary" onClick={() => {}}>Update Preferences</Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section">
              <h2>Notification Settings</h2>
              
              <div className="notification-list">
                <label className="notification-toggle">
                  <div className="notification-info">
                    <strong>Email Newsletters</strong>
                    <p>Receive updates about new features and products</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.notifications}
                    onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
                
                <label className="notification-toggle">
                  <div className="notification-info">
                    <strong>Price Alerts</strong>
                    <p>Get notified when items in your wishlist drop in price</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                
                <label className="notification-toggle">
                  <div className="notification-info">
                    <strong>Order Updates</strong>
                    <p>Receive notifications about your order status</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline component for the Badge since it's simple
function Badge({ children, variant = 'primary', className = '' }) {
  return <span className={`profile-badge-item variant-${variant} ${className}`}>{children}</span>;
}
