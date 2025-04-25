import { useEffect, useRef, useState } from 'react';
import '../styles/VoyageOverviewModal.css';
import GlobalParticipation from './GlobalParticipation';

// Voyage data object with all metrics
const voyageData = {
  visitors: {
    total: 13105,
    withWeb3Wallet: 8419,
    onboarded: 7315,
    walletConnections: 3110,
    recognitionQualified: 1663,
    rewardQualified: 582  // Sum of Quantum, Chrono, and Nebula tier users
  },
  synergy: {
    starters: 704,
    visitsByReferral: 7168
  },
  quests: {
    karma: 45221,
    educational: 14248,
    creative: 11290,
    totalCreated: 354,
    totalCompleted: 93602,
    averagePerUser: 12.8
  },
  contributions: {
    total: 384074,
    averagePerUser: 52.5
  },
  bits: {
    total: 20267316,
    averagePerUser: 2770.65
  }
};

// Format numbers with commas
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });
};

const VoyageOverviewModal = ({ onClose }) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modalRef, onClose]);

  return (
    <div className="voyage-modal-overlay">
      <div className="voyage-modal" ref={modalRef}>
        <button className="voyage-modal-close" onClick={onClose}>×</button>
        
        {/* Header Section */}
        <div className="voyage-modal-header">
          <div className="voyage-modal-title-container">
          <img 
            src="/robit-avatar.png" 
            alt="Robit" 
            className="voyage-robit-mascot" 
          />
            <div className="voyage-modal-title">
              <h2>Metis Voyage Overview</h2>
              <div className="voyage-robit-greeting">
                "Beep boop! Welcome to the Metis Voyage analytics dashboard! I've been tracking every bit of our journey together!"
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="voyage-quick-stats">
            <div className="voyage-stat">
              <div className="voyage-stat-value">{formatNumber(voyageData.visitors.onboarded)}</div>
              <div className="voyage-stat-label">Contributors</div>
            </div>
            <div className="voyage-stat">
              <div className="voyage-stat-value">{formatNumber(voyageData.bits.total)}</div>
              <div className="voyage-stat-label">Total BITS</div>
            </div>
            <div className="voyage-stat">
              <div className="voyage-stat-value">{formatNumber(voyageData.contributions.total)}</div>
              <div className="voyage-stat-label">Contributions</div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="voyage-tabs">
          <button 
            className={`voyage-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`voyage-tab ${activeTab === 'participation' ? 'active' : ''}`}
            onClick={() => setActiveTab('participation')}
          >
            Participation
          </button>
          <button 
            className={`voyage-tab ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            Contributions
          </button>
          <button 
            className={`voyage-tab ${activeTab === 'economy' ? 'active' : ''}`}
            onClick={() => setActiveTab('economy')}
          >
            BITS Economy
          </button>
          <button 
            className={`voyage-tab ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => setActiveTab('global')}
          >
            Global 🌎
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="voyage-content">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="voyage-tab-content">
              <div className="voyage-narrative">
                <div className="voyage-robit-message">
                  <img src="/robit-avatar.png" alt="Robit" className="voyage-robit-icon" />
                  <div className="voyage-message-bubble">
                    <p>"The intention was to create contribution pathways to help build our ecosystem. Every bit counts! There were many ways to get involved - from daily check-ins to creative contributions to on-chain quests. With nearly 400,000 contributions and over 20 million BITS distributed, you voyagers have been busy!"</p>
                  </div>
                </div>
              </div>
              
              <div className="voyage-metrics-grid">
                <div className="voyage-metric-card">
                  <h3>Community Size</h3>
                  <div className="voyage-card-content">
              <div className="voyage-funnel">
                <h4>Contributor Journey Breakdown</h4>
                <div className="voyage-funnel-chart">
                  <div className="voyage-funnel-step">
                    <div className="voyage-funnel-bar" style={{ width: '100%' }}>
                      <span className="voyage-funnel-label">Total Visits</span>
                      <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.total)}</span>
                      <span className="voyage-funnel-percent">100%</span>
                    </div>
                  </div>
                  <div className="voyage-funnel-step">
                    <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.onboarded / voyageData.visitors.total) * 100}%` }}>
                      <span className="voyage-funnel-label">Total Contributors</span>
                      <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.onboarded)}</span>
                      <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.onboarded / voyageData.visitors.total) * 100)}%</span>
                    </div>
                  </div>
                  <div className="voyage-funnel-step">
                    <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.walletConnections / voyageData.visitors.total) * 100}%` }}>
                      <span className="voyage-funnel-label">Web3 Connections</span>
                      <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.walletConnections)}</span>
                      <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.walletConnections / voyageData.visitors.total) * 100)}%</span>
                    </div>
                  </div>
                  <div className="voyage-funnel-step">
                    <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.recognitionQualified / voyageData.visitors.total) * 100}%` }}>
                      <span className="voyage-funnel-label">Recognition Qualified</span>
                      <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.recognitionQualified)}</span>
                      <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.recognitionQualified / voyageData.visitors.total) * 100)}%</span>
                    </div>
                  </div>
                  <div className="voyage-funnel-step">
                    <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.rewardQualified / voyageData.visitors.total) * 100}%` }}>
                      <span className="voyage-funnel-label">Reward Qualified</span>
                      <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.rewardQualified)}</span>
                      <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.rewardQualified / voyageData.visitors.total) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
                  </div>
                </div>
                
                <div className="voyage-metric-card">
                  <h3>Contribution Metrics</h3>
                  <div className="voyage-card-content">
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.quests.totalCompleted)}</span>
                      <span className="voyage-label">Quests Completed</span>
                    </div>
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.quests.averagePerUser)}</span>
                      <span className="voyage-label">Avg. Quests per Contributor</span>
                    </div>
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.bits.averagePerUser)}</span>
                      <span className="voyage-label">Avg. BITS per Contributor</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="voyage-narrative">
                <div className="voyage-robit-message reversed">
                  <div className="voyage-message-bubble">
                    <p>"Our synergy system recognized you with BITS your fellow contributors contributed. No bots here—beeps!—I'm the only robot on this voyage. Real recognize real. Together, 704 of you became Synergy Starters, bringing 7,168 new visitors to our community!"</p>
                  </div>
                  <img src="/robit-avatar.png" alt="Robit" className="voyage-robit-icon" />
                </div>
              </div>
            </div>
          )}
          
          {/* Participation Tab */}
          {activeTab === 'participation' && (
            <div className="voyage-tab-content">
              <div className="voyage-narrative">
                <div className="voyage-robit-message">
                  {/* No Robit image here to avoid multiple Robits on screen */}
                  <div className="voyage-message-bubble">
                    <p>"Identifying bots and spam is easy for me! What's special is how we designed everything from the ground up to recognize the most creative, consistent, active, and special contributors over time. A place where your time and contributions are valued!"</p>
                  </div>
                </div>
              </div>
              
              <div className="voyage-metrics-grid">
                <div className="voyage-metric-card">
                  <h3>Contributor Journey Breakdown</h3>
                  <div className="voyage-funnel">
                    <div className="voyage-funnel-chart">
                      <div className="voyage-funnel-step">
                        <div className="voyage-funnel-bar" style={{ width: '100%' }}>
                          <span className="voyage-funnel-label">Total Visits</span>
                          <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.total)}</span>
                          <span className="voyage-funnel-percent">100%</span>
                        </div>
                      </div>
                      <div className="voyage-funnel-step">
                        <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.onboarded / voyageData.visitors.total) * 100}%` }}>
                          <span className="voyage-funnel-label">Total Contributors</span>
                          <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.onboarded)}</span>
                          <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.onboarded / voyageData.visitors.total) * 100)}%</span>
                        </div>
                      </div>
                      <div className="voyage-funnel-step">
                        <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.walletConnections / voyageData.visitors.total) * 100}%` }}>
                          <span className="voyage-funnel-label">Web3 Connections</span>
                          <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.walletConnections)}</span>
                          <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.walletConnections / voyageData.visitors.total) * 100)}%</span>
                        </div>
                      </div>
                      <div className="voyage-funnel-step">
                        <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.recognitionQualified / voyageData.visitors.total) * 100}%` }}>
                          <span className="voyage-funnel-label">Recognition Qualified</span>
                          <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.recognitionQualified)}</span>
                          <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.recognitionQualified / voyageData.visitors.total) * 100)}%</span>
                        </div>
                      </div>
                      <div className="voyage-funnel-step">
                        <div className="voyage-funnel-bar" style={{ width: `${(voyageData.visitors.rewardQualified / voyageData.visitors.total) * 100}%` }}>
                          <span className="voyage-funnel-label">Reward Qualified</span>
                          <span className="voyage-funnel-number">{formatNumber(voyageData.visitors.rewardQualified)}</span>
                          <span className="voyage-funnel-percent">{Math.round((voyageData.visitors.rewardQualified / voyageData.visitors.total) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="voyage-metric-card">
                  <h3>Synergy Network</h3>
                  <div className="voyage-card-content">
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.synergy.starters)}</span>
                      <span className="voyage-label">Synergy Starters</span>
                    </div>
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.synergy.visitsByReferral)}</span>
                      <span className="voyage-label">Referred Visits</span>
                    </div>
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{(voyageData.synergy.visitsByReferral / voyageData.synergy.starters).toFixed(1)}</span>
                      <span className="voyage-label">Avg. Referrals per Starter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contributions Tab */}
          {activeTab === 'contributions' && (
            <div className="voyage-tab-content">
              <div className="voyage-narrative">
                <div className="voyage-robit-message">
                  {/* No Robit image here to avoid multiple Robits on screen */}
                  <div className="voyage-message-bubble">
                    <p>"The voyage has had live 24/7 human support helping me along the way. This is just the start—beeps! We're constantly updating based on your feedback, creating new dynamic ways to get involved. The feedback and contributions have been amazing!"</p>
                  </div>
                </div>
              </div>
              
              <div className="voyage-metrics-grid">
                <div className="voyage-metric-card">
                  <h3>Quest Completion</h3>
                  <div className="voyage-quest-card">
                    <div className="voyage-quest-type">
                      <span className="voyage-quest-name">Karma Quests</span>
                      <span className="voyage-quest-number">{formatNumber(voyageData.quests.karma)}</span>
                      <div className="voyage-quest-bar">
                        <div className="voyage-quest-fill karma" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    <div className="voyage-quest-type">
                      <span className="voyage-quest-name">Educational Quests</span>
                      <span className="voyage-quest-number">{formatNumber(voyageData.quests.educational)}</span>
                      <div className="voyage-quest-bar">
                        <div className="voyage-quest-fill educational" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="voyage-quest-type">
                      <span className="voyage-quest-name">Creative Submissions</span>
                      <span className="voyage-quest-number">{formatNumber(voyageData.quests.creative)}</span>
                      <div className="voyage-quest-bar">
                        <div className="voyage-quest-fill creative" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="voyage-card-stat centered">
                    <span className="voyage-number">{formatNumber(voyageData.quests.totalCreated)}</span>
                    <span className="voyage-label">Total Quests Created</span>
                  </div>
                </div>
                
                <div className="voyage-metric-card">
                  <h3>Contribution Activity</h3>
                  <div className="voyage-card-content">
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.contributions.total)}</span>
                      <span className="voyage-label">Total Contributions</span>
                    </div>
                    <div className="voyage-card-stat">
                      <span className="voyage-number">{formatNumber(voyageData.contributions.averagePerUser)}</span>
                      <span className="voyage-label">Avg. per Contributor</span>
                    </div>
                    <div className="voyage-card-summary">
                      On average, each contributor made <strong>{formatNumber(voyageData.contributions.averagePerUser)}</strong> contributions, helping to build a vibrant ecosystem.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* BITS Economy Tab */}
          {activeTab === 'economy' && (
            <div className="voyage-tab-content">
              <div className="voyage-narrative">
                <div className="voyage-robit-message">
                  {/* No Robit image here to avoid multiple Robits on screen */}
                  <div className="voyage-message-bubble">
                    <p>"We had 5,000 METIS to allocate—beeps!—and I made every token count. With over 20 million BITS distributed across 7,315 contributors, that's an average of 2,770 BITS per person! Each BITS was earned through real contribution."</p>
                  </div>
                </div>
              </div>
              
              <div className="voyage-metrics-grid">
                <div className="voyage-metric-card full-width">
                  <h3>BITS Distribution</h3>
                  <div className="voyage-economy-stats">
                    <div className="voyage-economy-stat">
                      <div className="voyage-economy-icon">💰</div>
                      <div className="voyage-economy-info">
                        <div className="voyage-economy-value">{formatNumber(voyageData.bits.total)}</div>
                        <div className="voyage-economy-label">Total BITS Distributed</div>
                      </div>
                    </div>
                    <div className="voyage-economy-stat">
                      <div className="voyage-economy-icon">👤</div>
                      <div className="voyage-economy-info">
                        <div className="voyage-economy-value">{formatNumber(voyageData.bits.averagePerUser)}</div>
                        <div className="voyage-economy-label">Average BITS per Contributor</div>
                      </div>
                    </div>
                    <div className="voyage-economy-stat">
                      <div className="voyage-economy-icon">🪙</div>
                      <div className="voyage-economy-info">
                        <div className="voyage-economy-value">5,000</div>
                        <div className="voyage-economy-label">Total METIS Allocated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="voyage-narrative">
                <div className="voyage-robit-message reversed">
                  <div className="voyage-message-bubble">
                    <p>"The top contributors have been recognized with METIS rewards! If you're in one of the top tiers, check your profile for reward details. Thank you all for your contributions to the Metis ecosystem!"</p>
                  </div>
                  {/* No Robit image here to avoid multiple Robits on screen */}
                </div>
              </div>
              
              <div className="voyage-tiers-info">
                <h3>Reward Tiers</h3>
                <div className="voyage-tiers-grid">
                  <div className="voyage-tier-card tier-quantum">
                    <div className="voyage-tier-name">Quantum Pathfinders</div>
                    <div className="voyage-tier-count">100 contributors</div>
                    <div className="voyage-tier-reward">16.00 METIS</div>
                  </div>
                  <div className="voyage-tier-card tier-chrono">
                    <div className="voyage-tier-name">Chrono Navigators</div>
                    <div className="voyage-tier-count">149 contributors</div>
                    <div className="voyage-tier-reward">9.40 METIS</div>
                  </div>
                  <div className="voyage-tier-card tier-nebula">
                    <div className="voyage-tier-name">Nebula Rangers</div>
                    <div className="voyage-tier-count">333 contributors</div>
                    <div className="voyage-tier-reward">3.00 METIS</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Global Participation Tab */}
          {activeTab === 'global' && (
            <div className="voyage-tab-content">
              <GlobalParticipation onClose={() => setActiveTab('overview')} />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="voyage-modal-footer">
          <div className="voyage-footer-message">
            <p>"This is just the beginning of our voyage together! - Robit"</p>
          </div>
          <button className="voyage-close-button" onClick={onClose}>Close Overview</button>
        </div>
      </div>
    </div>
  );
};

export default VoyageOverviewModal;
