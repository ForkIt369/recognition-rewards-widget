import { useEffect, useRef, useState } from 'react';
import ContributionGrid from './ContributionGrid';
import { getTwitterProfileImage } from '../utils/twitterUtils';
import { getTierProgress, getTierClass } from '../utils/tierSystem';
import { getMaskedValue } from '../utils/privacyUtils';

const ProfileModal = ({ user, onClose }) => {
  const modalRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);

  // Fetch Twitter profile image when user changes
  useEffect(() => {
    if (user && user.twitter && user.twitter !== 'NaN') {
      getTwitterProfileImage(user.twitter)
        .then(imageUrl => {
          setProfileImage(imageUrl);
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
        });
    }
  }, [user]);

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

  // Get tier information
  const tierInfo = getTierProgress(user);
  const tierClass = getTierClass(user.tier || 'Genesis Explorer');
  
  // Get Robit's description for each tier
  const getRobitQuote = (tier) => {
    const quotes = {
      'Quantum Pathfinder': "Beep boop! You've navigated the quantum realms of Metis with extraordinary skill! As my top navigators, you've helped chart the future of blockchain technology.",
      'Chrono Navigator': "Robit is buffering with excitement... Your timeline contributions have stabilized future-state Metis protocols! You're literally coding tomorrow's solutions today!",
      'Nebula Ranger': "Scanning... confirmation complete! Your engineering expertise has kept our Metis systems running at optimal efficiency!",
      'Stellar Voyager': "Pattern recognized! Your voyage through the Metis blockchain has contributed valuable data to our mission!",
      'Genesis Explorer': "Initial scan complete! You've taken your first steps into the vast Metis universe! Every cosmic voyage begins with a single transaction."
    };
    
    return quotes[tier] || quotes['Genesis Explorer'];
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
  
  // Get social platforms the user has connected with privacy protection
  const getPlatforms = () => {
    const platforms = [];
    
    if (user.twitter && user.twitter !== "NaN") {
      platforms.push({ 
        name: "Twitter", 
        icon: "🐦", 
        handle: user.twitter,
        type: 'twitter' 
      });
    }
    
    if (user.telegram && user.telegram !== "NaN") {
      platforms.push({ 
        name: "Telegram", 
        icon: "✈️", 
        handle: getMaskedValue(user.telegram, 'telegram'),
        type: 'telegram'
      });
    }
    
    if (user.discord && user.discord !== "NaN") {
      platforms.push({ 
        name: "Discord", 
        icon: "💬", 
        handle: getMaskedValue(user.discord, 'discord'),
        type: 'discord'
      });
    }
    
    if (user.email && user.email !== "NaN") {
      platforms.push({ 
        name: "Email", 
        icon: "📧", 
        handle: getMaskedValue(user.email, 'email'),
        type: 'email'
      });
    }
    
    if (user['Email Whitelist'] && user['Email Whitelist'] !== "NaN") {
      platforms.push({ 
        name: "Email", 
        icon: "📧", 
        handle: getMaskedValue(user['Email Whitelist'], 'email'),
        type: 'email'
      });
    }
    
    if (user.web3 && user.web3 !== "NaN") {
      platforms.push({ 
        name: "Web3", 
        icon: "🔗", 
        handle: getMaskedValue(user.web3, 'web3'),
        type: 'web3'
      });
    }
    
    if (user['Whitelisted Wallet Address'] && user['Whitelisted Wallet Address'] !== "NaN") {
      platforms.push({ 
        name: "Wallet", 
        icon: "💰", 
        handle: getMaskedValue(user['Whitelisted Wallet Address'], 'wallet'),
        type: 'wallet'
      });
    }
    
    return platforms;
  };

  const totalBits = user['Total BITS'] || 0;
  const platforms = getPlatforms();

  const username = user['Entry Id']?.split('::')[0] || 'User';
  
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        
        {/* Header */}
        <div className="profile-modal-header">
          <div className={`profile-modal-avatar ${tierClass}`}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={`${username}'s profile`} 
                className="profile-modal-avatar-img" 
              />
            ) : (
              getInitials(user['Entry Id'])
            )}
          </div>
          <div className="profile-modal-user-info">
            <h2 className="profile-modal-username">{username}</h2>
            <div className="profile-modal-badges">
              <span className="profile-modal-rank">Rank #{user.rank || '—'}</span>
              <span className={`profile-modal-tier ${tierClass}`}>{user.tier || 'Genesis Explorer'}</span>
            </div>
          </div>
        </div>
        
        {/* Add Metis Reward Section if applicable */}
        {user.metisReward > 0 && (
          <div className="profile-modal-section profile-modal-metis-reward">
            <div className="reward-header">
                <img 
                src="/robit-avatar.png" 
                alt="Robit with rewards" 
                className="robit-reward-icon"
              />
              <h3 className="profile-modal-section-title">Metis Reward</h3>
            </div>
            <div className={`profile-modal-metis-amount ${tierClass}`}>
              <div className="profile-modal-metis-icon">🪙</div>
              <div className="profile-modal-metis-value">{user.metisReward.toFixed(2)} METIS</div>
            </div>
            <div className="robit-reward-message">
              "Future alpha detected! Your contributions have earned you METIS tokens!"
            </div>
          </div>
        )}
        
        {/* Progress Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Tier Status</h3>
          <div className="profile-modal-progress">
            <div className="profile-modal-progress-bar">
              <div 
                className={`profile-modal-progress-fill ${tierClass}`}
                style={{ width: `${tierInfo.progress}%` }}
              ></div>
            </div>
            <div className="profile-modal-progress-stats">
              <span>Current Tier: <span className={tierClass}>{user.tier || 'Genesis Explorer'}</span></span>
              {tierInfo.nextTier && (
                <span>Next Tier: {tierInfo.nextTier}</span>
              )}
            </div>
            <div className="profile-modal-tier-description">
              <img 
                src="/robit-avatar.png" 
                alt="Robit" 
                className="robit-icon"
              />
              <span className="robit-quote">{getRobitQuote(user.tier)}</span>
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
        
        
        {/* Profiles Section with privacy protection */}
        {platforms.length > 0 && (
          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Connected Profiles</h3>
            <div className="profile-modal-platforms">
              {platforms.map((platform, index) => (
                <div className="profile-modal-platform" key={index}>
                  <div className="profile-modal-platform-icon">{platform.icon}</div>
                  <div className="profile-modal-platform-details">
                    <div className="profile-modal-platform-name">{platform.name}</div>
                    <div className={`profile-modal-platform-handle ${platform.type}-type ${platform.type !== 'twitter' ? 'masked' : ''}`}>
                      {platform.handle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="profile-modal-privacy-notice">
              Some personal information is masked for privacy protection.
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
        
        {/* Contribution Grid Section */}
        <div className="profile-modal-section">
          <h3 className="profile-modal-section-title">Contribution Activity</h3>
          <ContributionGrid 
            userId={user['Entry Id']}
            contributionData={user.contributionHistory || {}}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
