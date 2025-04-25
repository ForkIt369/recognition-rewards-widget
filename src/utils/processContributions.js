/**
 * Process raw contribution data into a format suitable for the ContributionGrid
 * @param {Array} rawData - Array of contribution records
 * @param {string} userId - User's Entry Id
 * @returns {Object} Processed contribution data by week
 */
export const processContributions = (rawData, userId) => {
  // Filter contributions for the specific user
  const userContributions = rawData.filter(record => 
    record['Entry Id'] === userId
  );

  // Group contributions by week
  const contributionsByWeek = userContributions.reduce((acc, record) => {
    // Parse the date string (format: "DD.MM.YYYY HH:mm:ss")
    const [datePart] = record.Date.split(' ');
    const [day, month, year] = datePart.split('.');
    const date = new Date(year, month - 1, day); // month is 0-based in JS

    const startDate = new Date('2024-11-01');
    const endDate = new Date('2025-04-30');
    
    if (date >= startDate && date <= endDate) {
      // Get the week number (0-based from start date)
      const timeDiff = date.getTime() - startDate.getTime();
      const weekNumber = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
      
      // Add to the week's total
      acc[weekNumber] = (acc[weekNumber] || 0) + 1;
    }
    
    return acc;
  }, {});

  return contributionsByWeek;
};

/**
 * Get the date range for the contribution grid
 * @returns {Object} Start and end dates
 */
export const getDateRange = () => {
  return {
    start: new Date('2024-11-01'),
    end: new Date('2025-04-30')
  };
};

/**
 * Format a date string to a consistent format
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get the total number of weeks in the date range
 * @returns {number} Number of weeks
 */
export const getTotalWeeks = () => {
  const { start, end } = getDateRange();
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (7 * 24 * 60 * 60 * 1000));
};
