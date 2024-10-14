import React from 'react';

const Pagination = ({ postsPerPage, length, handlePagination, currentPage }) => { // https://github.com/canhamzacode/pagination/blob/main/src/components/Pagination.jsx
    let paginationNumber = []
    for (let i = 1; i <= Math.ceil(length / postsPerPage); i++) {
        paginationNumber.push(i);
    }
    return (
        <div className='pagination'>
            {
                paginationNumber.map((data) => (
                    <button key={data} onClick={() => handlePagination(data)} className={currentPage === data ? 'active' : ''}>
                        {data}
                    </button>
                ))
            }
        </div>
    )
}

export default Pagination;