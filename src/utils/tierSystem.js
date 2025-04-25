/**
 * Assign tiers to users based on their rank
 * @param {Array} users - Array of user objects with rankings
 * @returns {Array} - Users with tier and metisReward properties added
 */
export const assignTiers = (users) => {
  return users.map((user, index) => {
    // Assign tier and Metis reward based on rank
    let tier, metisReward;
    
    if (index < 100) {
      tier = 'Quantum Pathfinder';
      metisReward = 16.00;
    } else if (index < 249) { // 100 + 149 = 249
      tier = 'Chrono Navigator';
      metisReward = 9.40;
    } else if (index < 582) { // 249 + 333 = 582
      tier = 'Nebula Ranger';
      metisReward = 3.00;
    } else if (index < 1247) { // 582 + 665 = 1247
      tier = 'Stellar Voyager';
      metisReward = 0;
    } else {
      tier = 'Genesis Explorer';
      metisReward = 0;
    }
    
    return {
      ...user,
      tier,
      metisReward
    };
  });
};

/**
 * Get tier color class for styling
 * @param {string} tier - User tier name
 * @returns {string} - CSS class name for the tier
 */
export const getTierClass = (tier) => {
  const tierClasses = {
    'Quantum Pathfinder': 'tier-quantum',
    'Chrono Navigator': 'tier-chrono',
    'Nebula Ranger': 'tier-nebula',
    'Stellar Voyager': 'tier-stellar',
    'Genesis Explorer': 'tier-genesis'
  };
  
  return tierClasses[tier] || 'tier-genesis';
};

/**
 * Get tier progress information for visualization
 * @param {Object} user - User object with tier information
 * @returns {Object} - Progress information including percentage
 */
export const getTierProgress = (user) => {
  const tierDisplayInfo = {
    'Quantum Pathfinder': {
      progress: 100,
      nextTier: null,
      description: 'Maximum tier achieved! You are among the top contributors.'
    },
    'Chrono Navigator': {
      progress: 75,
      nextTier: 'Quantum Pathfinder',
      description: 'Approaching the highest tier. Keep up the great work!'
    },
    'Nebula Ranger': {
      progress: 50,
      nextTier: 'Chrono Navigator',
      description: 'Solid contribution level. You\'re making great progress!'
    },
    'Stellar Voyager': {
      progress: 25,
      nextTier: 'Nebula Ranger',
      description: 'You\'re on your way! Continue your journey.'
    },
    'Genesis Explorer': {
      progress: 10,
      nextTier: 'Stellar Voyager',
      description: 'Just beginning your exploration. Welcome aboard!'
    }
  };
  
  return tierDisplayInfo[user.tier] || tierDisplayInfo['Genesis Explorer'];
};
