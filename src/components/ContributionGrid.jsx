import { useState, useEffect } from 'react';
import { getTotalWeeks, getDateRange } from '../utils/processContributions';

const ContributionGrid = ({ userId, contributionData }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Process data to create cumulative timeline
  const processCumulativeData = () => {
    const totalWeeks = getTotalWeeks();
    const { start: startDate } = getDateRange();
    const timelineData = [];
    let cumulativeTotal = 0;
    
    // Create week points with cumulative totals
    for (let i = 0; i < totalWeeks; i++) {
      // Get week date
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + (i * 7));
      
      // Add this week's contributions to cumulative total
      cumulativeTotal += (contributionData[i] || 0);
      
      // Add point to timeline
      timelineData.push({
        weekNumber: i,
        date: weekDate,
        weeklyCount: contributionData[i] || 0,
        cumulativeTotal: cumulativeTotal
      });
    }
    
    return timelineData;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle mouse events for tooltip
  const handleMouseEnter = (e, point) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 40
    });
    setTooltipContent(`${formatDate(point.date)}: ${point.cumulativeTotal} total contributions`);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Get month labels
  const getMonthLabels = () => {
    const { start, end } = getDateRange();
    const months = [];
    
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'short' });
      if (!months.includes(monthLabel)) {
        months.push(monthLabel);
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };

  // Calculate timeline chart dimensions
  const renderTimeline = () => {
    const timelineData = processCumulativeData();
    const maxValue = timelineData.length > 0 ? 
      timelineData[timelineData.length - 1].cumulativeTotal : 0;
    
    // Skip rendering if no data
    if (maxValue === 0) {
      return <div className="no-contributions">No contribution data available</div>;
    }
    
    // Create SVG points for line
    const points = timelineData.map((point, index) => {
      const x = (index / (timelineData.length - 1)) * 100 + '%';
      // Invert y value since SVG coordinates start from top
      const y = maxValue === 0 ? '100%' : (100 - (point.cumulativeTotal / maxValue * 100)) + '%';
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="contribution-timeline">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Line chart */}
          <polyline
            points={points}
            fill="none"
            stroke="#4caf50"
            strokeWidth="2"
          />
          
          {/* Area under curve */}
          <polyline
            points={`0,100 ${points} 100,100`}
            fill="rgba(76, 175, 80, 0.2)"
          />
        </svg>
        
        {/* Interactive points */}
        <div className="interactive-points">
          {timelineData.map((point, index) => {
            const leftPos = (index / (timelineData.length - 1)) * 100;
            const topPos = maxValue === 0 ? 100 : (100 - (point.cumulativeTotal / maxValue * 100));
            
            return (
              <div
                key={`point-${index}`}
                className="timeline-point"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`
                }}
                onMouseEnter={(e) => handleMouseEnter(e, point)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="contribution-timeline-container">
      {/* Month labels */}
      <div className="month-labels">
        {getMonthLabels().map((month, i) => (
          <div key={`month-${i}`} className="month-label">
            {month}
          </div>
        ))}
      </div>
      
      {/* Timeline */}
      {renderTimeline()}
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="contribution-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default ContributionGrid;
