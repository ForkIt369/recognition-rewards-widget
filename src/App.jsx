import { useState, useEffect } from 'react'
import data from './recognition-data.json'
import './App.css'
import ProfileModal from './components/ProfileModal'
import Pagination from './components/Pagination'

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 50;

  useEffect(() => {
    // Fix the data structure and sort by BITS
    const processedUsers = [...data].map((user, index) => {
      // Fix tier names based on the numeric values
      const tierMap = {
        "1": "Bronze",
        "2": "Silver", 
        "3": "Gold",
        "4": "Platinum"
      };
      
      // Ensure we're using the right Total BITS field (it might be BITS_x)
      const totalBits = user['Total BITS'] || user['Total BITS_x'] || 0;
      
      return {
        ...user,
        'Total BITS': totalBits,
        'Preliminary Tier': user['Preliminary Tier'] ? tierMap[user['Preliminary Tier'].toString()] || "Bronze" : "Bronze",
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
    
    setUsers(rankedUsers);
    setLoading(false);
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

  // Function to calculate tier progress percentage
  const getTierProgress = (user) => {
    const tierThresholds = {
      "Bronze": 1000,
      "Silver": 10000,
      "Gold": 50000,
      "Platinum": 100000
    };
    
    const currentTier = user['Preliminary Tier'] || 'Bronze';
    const nextTier = currentTier === 'Bronze' ? 'Silver' : 
                     currentTier === 'Silver' ? 'Gold' : 
                     currentTier === 'Gold' ? 'Platinum' : 'Platinum';
    
    if (currentTier === 'Platinum') return 100;
    
    const currentThreshold = tierThresholds[currentTier] || 0;
    const nextThreshold = tierThresholds[nextTier] || 100000;
    const bits = user['Total BITS'] || 0;
    const progress = ((bits - currentThreshold) / 
                     (nextThreshold - currentThreshold)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  // Function to format numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle user row click - open the modal
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="recognition-widget-root">
      <div className="recognition-leaderboard">
        <div className="recognition-leaderboard-title">
          Recognition Leaderboard
          <span className="recognition-leaderboard-count">
            {users.length} Total Users
          </span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading...</div>
        ) : (
          <>
            {currentUsers.map((user, index) => {
              const actualRank = currentPage * usersPerPage + index + 1;
              return (
                <div 
                  key={index} 
                  className={`recognition-user-row ${actualRank === 4 ? 'current-user-row' : ''}`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="recognition-rank">{actualRank}</div>
                  <div className="recognition-avatar">
                    {getInitials(user['Entry Id'])}
                  </div>
                  <div className="recognition-user-info">
                    <div className="recognition-user-name">
                      {user['Entry Id'].split('::')[0]}
                      <span className="recognition-tier-badge">
                        {user['Preliminary Tier']}
                      </span>
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
                    </div>
                    <div className="recognition-progress-bar">
                      <div 
                        className="recognition-progress-bar-fill" 
                        style={{ width: `${getTierProgress(user)}%` }}
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
      
      {/* Modal */}
      {showModal && selectedUser && (
        <ProfileModal 
          user={selectedUser} 
          onClose={closeModal} 
        />
      )}
    </div>
  )
}

export default App
