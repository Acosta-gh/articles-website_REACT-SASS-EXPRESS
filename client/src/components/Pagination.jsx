import React from 'react';

const Pagination = ({ postsPerPage, length, handlePagination, currentPage }) => {
    const maxVisible = 7; 
    const totalPages = Math.ceil(length / postsPerPage);

    if (totalPages <= 1) return null;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    const paginationNumbers = [];
    for (let i = start; i <= end; i++) {
        paginationNumbers.push(i);
    }

    const showStartEllipsis = start > 2;
    const showEndEllipsis = end < totalPages - 1;

    return (
        <div className='pagination'>
            {start > 1 && (
                <>
                    <button onClick={() => handlePagination(1)} className={currentPage === 1 ? 'active' : ''}>1</button>
                    {showStartEllipsis && <span className="pagination-ellipsis">...</span>}
                </>
            )}
            {paginationNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => handlePagination(num)}
                    className={currentPage === num ? 'active' : ''}
                >
                    {num}
                </button>
            ))}
            {end < totalPages && (
                <>
                    {showEndEllipsis && <span className="pagination-ellipsis">...</span>}
                    <button onClick={() => handlePagination(totalPages)} className={currentPage === totalPages ? 'active' : ''}>{totalPages}</button>
                </>
            )}
        </div>
    );
};

export default Pagination;