import React, { useState, useEffect } from 'react';
import './Paginator.css';
import backIcon from '../../assets/bx-chevron-left.svg';
import nextIcon from '../../assets/bx-chevron-right.svg';

const Paginator = (props) => {
    const { page, setPage, numPages } = props;
    const [input, setInput] = useState(1);

    useEffect(() => {
        setInput(page);
    }, [page]);

    const nextPage = () => {
        const newPage = page + 1;
        if (newPage <= numPages) {
            setPage(newPage);
        }
    };

    const prevPage = () => {
        const newPage = page - 1;
        if (newPage >= 1) {
            setPage(newPage);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleInputBlur = () => {
        const newPage = parseInt(input, 10);
        if (newPage >= 1 && newPage <= numPages) {
            setPage(newPage);
        } else {
            setInput(page);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const newPage = parseInt(input, 10);
            if (newPage >= 1 && newPage <= numPages) {
                setPage(newPage);
            } else {
                setInput(page);
            }
        }
    };

    return (
        <div className='paginator'>
            {page === 1 ? null : (
                <button className='paginator-control' onClick={prevPage}>
                    <img src={backIcon} />
                </button>
            )}
            <div className="page-counter">
                <input className='page-selector' type='number' value={input} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleKeyDown} />
                <p className='actual-page'>de {numPages}</p>
            </div>
            {page === numPages ? null : (
                <button className='paginator-control' onClick={nextPage}>
                    <img src={nextIcon} />
                </button>  
            )}
        </div>
    );
};

export default Paginator;
