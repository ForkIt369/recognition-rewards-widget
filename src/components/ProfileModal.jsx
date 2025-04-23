import { useEffect, useRef } from 'react';

const ProfileModal = ({ user, onClose }) => {
  const modalRef = useRef(null);

  // Format BITS with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, onClose]);

  // Get tier threshold for progress calculation
  const getTierThreshold = (tier) => {
    const thresholds = {
      "Bronze": { current: 0, next: 1000 },
      "Silver": { current: 1000, next: 10000 },
      "Gold": { current: 10000, next: 50000 },
      "Platinum": { current: 50000, next: 100000 }
    };
    
    return thresholds[tier] || thresholds["Bronze"];
  };
  
  // Calculate progress percentage to next tier
  const calculateProgress = () => {
    const tier = user['Preliminary Tier'] || 'Bronze';
    const totalBits = user['Total BITS'] || 0;
    const { current, next } = getTierThreshold(tier);
    
    if (tier === 'Platinum') return 100;
    
    return Math.min(((totalBits - current) / (next - current)) * 100, 100);
  };
  
  // Get initials for avatar
  const getInitials = (entry) => {
    if (!entry) return "?";
    const username = entry.split('::')[0];
    if (username.indexOf(" ") === -1) {
      return username.substring(0, 2).toUpperCase();
    }
    const words = username.split(" ");
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  
  // Get social platforms the user has connected
  const getPlatforms = () => {
    const platforms = [];
    
    if (user.twitter && user.twitter !== "NaN") {
      platforms.push({ name: "Twitter", icon: "🐦", handle: user.twitter });
    }
    
    if (user.telegram && user.telegram !== "NaN") {
      platforms.push({ name: "Telegram", icon: "✈️", handle: user.telegram });
    }
    
    if (user.discord && user.discord !== "NaN") {
      platforms.push({ name: "Discord", icon: "💬", handle: user.discord });
    }
    
    if (user.email && user.email !== "NaN") {
      platforms.push({ name: "Email", icon: "📧", handle: user.email });
    }
    
    if (user['Email Whitelist'] && user['Email Whitelist'] !== "NaN") {
      platforms.push({ name: "Email", icon: "📧", handle: user['Email Whitelist'] });
    }
    
    if (user.web3 && user.web3 !== "NaN") {
      platforms.push({ name: "Web3", icon: "🔗", handle: user.web3 });
    }
    
    if (user['Whitelisted Wallet Address'] && user['Whitelisted Wallet Address'] !== "NaN") {
      platforms.push({ 
        name: "Wallet", 
        icon: "💰", 
        handle: `${user['Whitelisted Wallet Address'].substring(0, 6)}...${user['Whitelisted Wallet Address'].substring(user['Whitelisted Wallet Address'].length - 4)}` 
      });
    }
    
    return platforms;
  };

  const tier = user['Preliminary Tier'] || 'Bronze';
  const totalBits = user['Total BITS'] || 0;
  const { current, next } = getTierThreshold(tier);
  const progress = calculateProgress();
  const platforms = getPlatforms();

  const username = user['Entry Id']?.split('::')[0] || 'User';
  
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-avatar">
            {getInitials(user['Entry Id'])}
          </div>
          <div className="profile-modal-user-info">
            <h2 className="profile-modal-username">{username}</h2>
            <div className="profile-modal-badges">
              <span className="profile-modal-tier">{tier}</span>
              <span className="profile-modal-rank">Rank #{user.rank || '—'}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Tier Progress</h3>
          <div className="profile-modal-progress">
            <div className="profile-modal-progress-bar">
              <div 
                className="profile-modal-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="profile-modal-progress-stats">
              <span>Current: {formatNumber(totalBits)} BITS</span>
              {tier !== 'Platinum' && <span>Next Tier: {formatNumber(next)} BITS</span>}
              {tier === 'Platinum' && <span>Max Tier Reached!</span>}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Contribution Stats</h3>
          <div className="profile-modal-stats">
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(totalBits)}</div>
              <div className="profile-modal-stat-label">Total BITS</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Total Contributions'] || 0)}</div>
              <div className="profile-modal-stat-label">Contributions</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Active Days'] || 0)}</div>
              <div className="profile-modal-stat-label">Active Days</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Avg Weekly Actions'] || 0)}</div>
              <div className="profile-modal-stat-label">Avg Weekly</div>
            </div>
          </div>
        </div>
        
        {/* Engagement Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Engagement Pattern</h3>
          <div className="profile-modal-engagement">
            <div className="profile-modal-engagement-badge">
              {user['Engagement Pattern'] || 'Contributor'}
            </div>
            <div className="profile-modal-engagement-description">
              {user['Engagement Pattern'] === 'Burst Contributor' && 'Makes many contributions in short periods of time'}
              {user['Engagement Pattern'] === 'Consistent Contributor' && 'Makes regular contributions over time'}
              {user['Engagement Pattern'] === 'Occasional Specialist' && 'Makes fewer but valuable contributions'}
              {!user['Engagement Pattern'] && 'Regular community participant'}
            </div>
          </div>
        </div>
        
        {/* Profiles Section */}
        {platforms.length > 0 && (
          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Connected Profiles</h3>
            <div className="profile-modal-platforms">
              {platforms.map((platform, index) => (
                <div className="profile-modal-platform" key={index}>
                  <div className="profile-modal-platform-icon">{platform.icon}</div>
                  <div className="profile-modal-platform-details">
                    <div className="profile-modal-platform-name">{platform.name}</div>
                    <div className="profile-modal-platform-handle">{platform.handle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Referrals Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Referral Network</h3>
          <div className="profile-modal-referrals">
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Total Referrals'] || 0)}</div>
              <div className="profile-modal-stat-label">Total Referrals</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Referral Contribution Count'] || 0)}</div>
              <div className="profile-modal-stat-label">Network Actions</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{formatNumber(user['Referral Quality Score (BITS)'] || 0)}</div>
              <div className="profile-modal-stat-label">Network BITS</div>
            </div>
            <div className="profile-modal-stat">
              <div className="profile-modal-stat-value">{user['Is Referrer'] ? 'Yes' : 'No'}</div>
              <div className="profile-modal-stat-label">Is Referrer</div>
            </div>
          </div>
        </div>
        
        {/* Join & Last Active Section */}
        <div className="profile-modal-section profile-modal-dates">
          <div className="profile-modal-date">
            <div className="profile-modal-date-label">First Activity:</div>
            <div className="profile-modal-date-value">{user['First Contribution Date'] || user['Date'] || '—'}</div>
          </div>
          <div className="profile-modal-date">
            <div className="profile-modal-date-label">Last Activity:</div>
            <div className="profile-modal-date-value">{user['Last Contribution Date'] || user['Last Action'] || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
