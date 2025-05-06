import { useState, useEffect } from 'react'
import Pagination from './Pagination'
import { getTierClass } from '../utils/tierSystem'
import { getMaskedValue } from '../utils/privacyUtils'

// Dynamically import bot check map
let botCheckMapPromise = null;
function getBotCheckMap() {
  if (!botCheckMapPromise) {
    botCheckMapPromise = import('../botCheckMap.json').then(mod => mod.default || mod);
  }
  return botCheckMapPromise;
}

const BotAnalysisDashboard = ({ users }) => {
  const [botCheckMap, setBotCheckMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedView, setSelectedView] = useState('all'); // all, bots, suspicious, verified
  const [selectedFilter, setSelectedFilter] = useState('risk'); // risk, bot, email, debank
  const usersPerPage = 50;
  const [stats, setStats] = useState({
    totalUsers: 0,
    botUsers: 0,
    flaggedUsers: 0,
    verifiedUsers: 0,
    totalBits: 0,
    botBits: 0,
    flaggedBits: 0,
    totalSpamBits: 0,
    totalSpamReferrals: 0
  });

  // Load bot check data
  useEffect(() => {
    let isMounted = true;
    getBotCheckMap().then(map => {
      if (!isMounted) return;
      setBotCheckMap(map);
      setLoading(false);
    }).catch(error => {
      console.error("Error loading bot check map:", error);
      if (isMounted) {
        setBotCheckMap({});
        setLoading(false);
      }
    });
    
    return () => { isMounted = false; };
  }, []);
  
  // Calculate statistics once we have both users and bot check data
  useEffect(() => {
    if (!users || !users.length || !botCheckMap || Object.keys(botCheckMap).length === 0) {
      return;
    }
    
    // Calculate stats
    const stats = {
      totalUsers: users.length,
      botUsers: 0,
      flaggedUsers: 0,
      verifiedUsers: 0,
      totalBits: 0,
      botBits: 0,
      flaggedBits: 0,
      totalSpamBits: 0,
      totalSpamReferrals: 0
    };
    
    users.forEach(user => {
      const entryId = user['Entry Id'];
      const bits = user['Total BITS'] || 0;
      const botCheck = botCheckMap[entryId];
      
      stats.totalBits += bits;
      
      if (botCheck) {
        if (botCheck.isBot) {
          stats.botUsers++;
          stats.botBits += bits;
        }
        
        if (botCheck.emailFlag || botCheck.debankFlag || botCheck.shScriptFlag) {
          stats.flaggedUsers++;
          stats.flaggedBits += bits;
        }
        
        if (botCheck.isVerifiedReferrer) {
          stats.verifiedUsers++;
        }
        
        stats.totalSpamBits += botCheck.spamSynergyBits || 0;
        stats.totalSpamReferrals += botCheck.spamReferrals || 0;
      }
    });
    
    setStats(stats);
  }, [users, botCheckMap]);
  
  // Filter users based on selected view
  const getFilteredUsers = () => {
    if (!users || !botCheckMap) return [];
    
    return users.filter(user => {
      const entryId = user['Entry Id'];
      const botCheck = botCheckMap[entryId];
      
      if (!botCheck) return selectedView === 'all';
      
      switch (selectedView) {
        case 'bots':
          return botCheck.isBot;
        case 'suspicious':
          return botCheck.emailFlag || botCheck.debankFlag || botCheck.shScriptFlag;
        case 'verified':
          return botCheck.isVerifiedReferrer;
        case 'all':
        default:
          return true;
      }
    });
  };
  
  // Sort users based on selected filter
  const getSortedUsers = () => {
    const filteredUsers = getFilteredUsers();
    
    return filteredUsers.sort((a, b) => {
      const aCheck = botCheckMap[a['Entry Id']] || {};
      const bCheck = botCheckMap[b['Entry Id']] || {};
      
      switch (selectedFilter) {
        case 'risk':
          return (bCheck.riskScore || 0) - (aCheck.riskScore || 0);
        case 'bot':
          return Number(bCheck.isBot) - Number(aCheck.isBot);
        case 'email':
          return Number(bCheck.emailFlag) - Number(aCheck.emailFlag);
        case 'debank':
          return Number(bCheck.debankFlag) - Number(aCheck.debankFlag);
        default:
          return 0;
      }
    });
  };
  
  // Get current page's users
  const currentUsers = getSortedUsers().slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };
  
  // Function to get initials from Entry Id
  const getInitials = (entry) => {
    if (!entry) return "?";
    // Extract username part before :: if possible
    const username = entry.split('::')[0];
    // Use first two characters if no space found
    if (username.indexOf(" ") === -1) {
      return username.substring(0, 2).toUpperCase();
    }
    // Otherwise use first letter of first and last name
    const words = username.split(" ");
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  
  // Format number with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate total pages
  const totalUsers = getFilteredUsers().length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  
  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 70) return 'high-risk';
    if (score >= 30) return 'medium-risk';
    return 'low-risk';
  };

  return (
    <div className="bot-analysis-dashboard">
      <div className="bot-analysis-header">
        <div className="bot-analysis-title">
          <h2>Bot Analysis Dashboard</h2>
          <p className="bot-analysis-subtitle">
            Monitoring and detection of suspicious activities
          </p>
        </div>
        <div className="bot-analysis-stats">
          <div className="bot-stat-card">
            <div className="bot-stat-value">{stats.botUsers}</div>
            <div className="bot-stat-label">Bot Users</div>
            <div className="bot-stat-percentage">
              {stats.totalUsers ? ((stats.botUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="bot-stat-card">
            <div className="bot-stat-value">{formatNumber(stats.botBits)}</div>
            <div className="bot-stat-label">Bot BITS</div>
            <div className="bot-stat-percentage">
              {stats.totalBits ? ((stats.botBits / stats.totalBits) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="bot-stat-card">
            <div className="bot-stat-value">{formatNumber(stats.totalSpamBits)}</div>
            <div className="bot-stat-label">Spam BITS</div>
          </div>
          <div className="bot-stat-card">
            <div className="bot-stat-value">{stats.totalSpamReferrals}</div>
            <div className="bot-stat-label">Spam Referrals</div>
          </div>
        </div>
      </div>
      
      <div className="bot-analysis-controls">
        <div className="bot-view-selector">
          <button 
            className={`bot-view-button ${selectedView === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedView('all')}
          >
            All Users
          </button>
          <button 
            className={`bot-view-button ${selectedView === 'bots' ? 'active' : ''}`}
            onClick={() => setSelectedView('bots')}
          >
            Bots
          </button>
          <button 
            className={`bot-view-button ${selectedView === 'suspicious' ? 'active' : ''}`}
            onClick={() => setSelectedView('suspicious')}
          >
            Suspicious
          </button>
          <button 
            className={`bot-view-button ${selectedView === 'verified' ? 'active' : ''}`}
            onClick={() => setSelectedView('verified')}
          >
            Verified
          </button>
        </div>
        <div className="bot-filter-selector">
          <label>Sort by:</label>
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bot-filter-dropdown"
          >
            <option value="risk">Risk Score</option>
            <option value="bot">Bot Flag</option>
            <option value="email">Email Flag</option>
            <option value="debank">Debank Flag</option>
          </select>
        </div>
      </div>
      
      <div className="bot-users-container">
        {loading ? (
          <div className="loading-container">
            <div>Loading bot analysis data...</div>
          </div>
        ) : (
          <>
            {currentUsers.length === 0 ? (
              <div className="no-results">
                No users match the selected filter.
              </div>
            ) : (
              currentUsers.map((user, index) => {
                const botCheck = botCheckMap[user['Entry Id']] || {};
                const riskLevel = getRiskLevel(botCheck.riskScore || 0);
                const tierClass = getTierClass(user.tier);
                
                return (
                  <div 
                    key={index} 
                    className={`bot-user-row ${riskLevel}`}
                  >
                    <div className="bot-user-basic-info">
                      <div className={`recognition-avatar ${tierClass}`}>
                        {getInitials(user['Entry Id'])}
                      </div>
                      <div className="bot-user-details">
                        <div className="bot-user-name">
                          {user['Entry Id'].split('::')[0]}
                          <span className={`recognition-user-tier ${tierClass}`}>{user.tier}</span>
                        </div>
                        <div className="bot-user-metrics">
                          <span className="bot-user-metric">
                            <span className="icon">💎</span>
                            <span className="recognition-bits">{formatNumber(user['Total BITS'])}</span> BITS
                          </span>
                          <span className="bot-user-metric">
                            <span className="icon">🔄</span>
                            {formatNumber(user['Total Actions'] || 0)} Contributions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bot-user-flags">
                      <div className="bot-flag-row">
                        <span className="bot-flag-label">Risk Score:</span>
                        <div className={`bot-risk-indicator ${riskLevel}`}>
                          {botCheck.riskScore || 0}
                        </div>
                      </div>
                      <div className="bot-flag-row">
                        <span className="bot-flag-label">Bot Flag:</span>
                        <span className={`bot-flag ${botCheck.isBot ? 'flagged' : ''}`}>
                          {botCheck.isBot ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="bot-flag-row">
                        <span className="bot-flag-label">Email Flag:</span>
                        <span className={`bot-flag ${botCheck.emailFlag ? 'flagged' : ''}`}>
                          {botCheck.emailFlag ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="bot-flag-row">
                        <span className="bot-flag-label">Debank Flag:</span>
                        <span className={`bot-flag ${botCheck.debankFlag ? 'flagged' : ''}`}>
                          {botCheck.debankFlag ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bot-user-details-panel">
                      <div className="bot-detail-row">
                        <span className="bot-detail-label">Wallet:</span>
                        <span className="bot-detail-value masked">
                          {getMaskedValue(botCheck.wallet || '', 'wallet')}
                        </span>
                      </div>
                      <div className="bot-detail-row">
                        <span className="bot-detail-label">Email:</span>
                        <span className="bot-detail-value masked">
                          {getMaskedValue(botCheck.email || '', 'email')}
                        </span>
                      </div>
                      <div className="bot-detail-row">
                        <span className="bot-detail-label">Countries:</span>
                        <span className="bot-detail-value">
                          {(botCheck.countries || []).join(', ') || 'Unknown'}
                        </span>
                      </div>
                      <div className="bot-detail-row">
                        <span className="bot-detail-label">Spam Refs:</span>
                        <span className="bot-detail-value">
                          {botCheck.spamReferrals || 0}
                        </span>
                      </div>
                      <div className="bot-detail-row">
                        <span className="bot-detail-label">Spam BITS:</span>
                        <span className="bot-detail-value">
                          {formatNumber(botCheck.spamSynergyBits || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BotAnalysisDashboard;
