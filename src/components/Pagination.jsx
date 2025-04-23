import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate the range of page numbers to display (at most 5)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      // If total pages is less than or equal to max buttons, show all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page, and two adjacent pages
      if (currentPage < 2) {
        // Near the beginning
        for (let i = 0; i < 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages - 1);
      } else if (currentPage > totalPages - 3) {
        // Near the end
        pageNumbers.push(0);
        for (let i = totalPages - 4; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(0);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  return (
    <div className="recognition-pagination">
      <button 
        className="recognition-pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt; Previous
      </button>
      
      <div className="recognition-pagination-numbers">
        {pageNumbers.map((pageNumber, index) => {
          // Add ellipsis between non-consecutive numbers
          if (index > 0 && pageNumber > pageNumbers[index - 1] + 1) {
            return (
              <React.Fragment key={`ellipsis-${index}`}>
                <span className="recognition-pagination-ellipsis">...</span>
                <button
                  className={`recognition-pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              </React.Fragment>
            );
          }
          
          return (
            <button
              key={pageNumber}
              className={`recognition-pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber + 1}
            </button>
          );
        })}
      </div>
      
      <button 
        className="recognition-pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
