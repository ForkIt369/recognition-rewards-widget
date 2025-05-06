import { useState, useEffect } from 'react'
import data from './recognition-data.json'
import './App.css'
import './styles/BotAnalysisDashboard.css'
import ProfileModal from './components/ProfileModal'
import Pagination from './components/Pagination'
import VoyageOverviewModal from './components/VoyageOverviewModal'
import BotAnalysisDashboard from './components/BotAnalysisDashboard'
import { processContributions } from './utils/processContributions'
import { getBulkTwitterProfileImages } from './utils/twitterUtils'
import { assignTiers, getTierProgress, getTierClass } from './utils/tierSystem'

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [profileImages, setProfileImages] = useState({});
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' or 'botAnalysis'
  const usersPerPage = 50;

  useEffect(() => {
    // Process the data
    const processedUsers = [...data].map((user, index) => {
      // Ensure we're using the right Total BITS field (it might be BITS_x)
      const totalBits = user['Total BITS'] || user['Total BITS_x'] || 0;
      
      // Process contribution history
      const contributionHistory = processContributions(data, user['Entry Id']);
      
      return {
        ...user,
        'Total BITS': totalBits,
        contributionHistory
      };
    });
    
    // Sort by Total BITS descending
    const sortedUsers = processedUsers.sort((a, b) => 
      (b['Total BITS'] || 0) - (a['Total BITS'] || 0)
    );
    
    // Add rank to each user based on sorted position
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    // Apply the new tier system
    const tieredUsers = assignTiers(rankedUsers);
    
    setUsers(tieredUsers);
    setLoading(false);
    
    // Collect Twitter handles for bulk fetching
    const twitterHandles = sortedUsers
      .filter(user => user.twitter && user.twitter !== 'NaN')
      .map(user => user.twitter);
    
    // Fetch Twitter profile images in bulk
    if (twitterHandles.length > 0) {
      getBulkTwitterProfileImages(twitterHandles)
        .then(images => {
          setProfileImages(images);
        })
        .catch(error => {
          console.error('Error fetching Twitter profile images:', error);
        });
    }
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);
  
  // Get current page's users
  const currentUsers = users.slice(
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

  // Function to get tier progress information
  const getTierProgressInfo = (user) => {
    return getTierProgress(user);
  };

  // Function to format numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle user row click - open the modal
  const handleUserClick = (user) => {
    console.log('Selected user contributions:', user.contributionHistory);
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'botAnalysis':
        return <BotAnalysisDashboard users={users} />;
      case 'leaderboard':
      default:
        return renderLeaderboard();
    }
  };
  
  const renderLeaderboard = () => {
    return (
      <div className="recognition-leaderboard">
        <div className="recognition-leaderboard-header">
          <img 
            src="/robit-avatar.png" 
            alt="Robit - Metis Voyage Guide" 
            className="robit-mascot"
          />
          <div className="recognition-leaderboard-title-container">
            <div className="recognition-leaderboard-title">
              Recognition Leaderboard
            </div>
            <div className="robit-message">
              "Beep boop! I've identified our top Metis Voyagers!"
            </div>
            <span className="recognition-leaderboard-count">
              {users.length} Total Contributors
            </span>
            <button 
              className="voyage-overview-button"
              onClick={() => setShowOverview(true)}
            >
              <span>Voyage Analytics</span>
              <img src="/robit-avatar.png" alt="Robit" className="robit-button-icon" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <img 
              src="/robit-avatar.png" 
              alt="Robit loading" 
              className="robit-loading"
            />
            <div>Robit is analyzing Metis Voyage data...</div>
          </div>
        ) : (
          <>
            {currentUsers.map((user, index) => {
              const actualRank = currentPage * usersPerPage + index + 1;
              const tierInfo = getTierProgressInfo(user);
              const tierClass = getTierClass(user.tier);
              
              return (
                <div 
                  key={index} 
                  className={`recognition-user-row ${actualRank === 4 ? 'current-user-row' : ''} ${tierClass}`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="recognition-rank">{actualRank}</div>
                  <div className={`recognition-avatar ${tierClass}`}>
                    {user.twitter && profileImages[user.twitter] ? (
                      <img 
                        src={profileImages[user.twitter]} 
                        alt={`${user['Entry Id'].split('::')[0]}'s profile`} 
                        className="recognition-avatar-img"
                      />
                    ) : (
                      getInitials(user['Entry Id'])
                    )}
                  </div>
                  <div className="recognition-user-info">
                    <div className="recognition-user-name">
                      {user['Entry Id'].split('::')[0]}
                      <span className={`recognition-user-tier ${tierClass}`}>{user.tier}</span>
                    </div>
                    <div className="recognition-metrics">
                      <span className="recognition-metric">
                        <span className="icon">💎</span>
                        <span className="recognition-bits">{formatNumber(user['Total BITS'])}</span> BITS
                      </span>
                      <span className="recognition-metric">
                        <span className="icon">🔄</span>
                        {formatNumber(user['Total Actions'] || 0)} Contributions
                      </span>
                      <span className="recognition-metric">
                        <span className="icon">👥</span>
                        {formatNumber(user['Total Referrals'] || 0)} Referrals
                      </span>
                      
                      {/* Metis reward display removed as requested */}
                      
                    </div>
                    <div className="recognition-progress-bar">
                      <div 
                        className={`recognition-progress-bar-fill ${tierClass}`}
                        style={{ width: `${tierInfo.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
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
      
    );
  };

  return (
    <div className="recognition-widget-root">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Recognition Leaderboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'botAnalysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('botAnalysis')}
        >
          Bot Analysis
        </button>
      </div>
      
      {/* Render active tab content */}
      {renderActiveTab()}
      
      {/* User Profile Modal */}
      {showModal && selectedUser && (
        <ProfileModal 
          user={selectedUser} 
          onClose={closeModal} 
        />
      )}
      
      {/* Voyage Overview Modal */}
      {showOverview && (
        <VoyageOverviewModal 
          onClose={() => setShowOverview(false)} 
        />
      )}
    </div>
  )
}

export default App
