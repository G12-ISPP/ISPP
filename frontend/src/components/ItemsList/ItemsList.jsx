import React from 'react';
import './ItemsList.css';

const ItemsList = ({ items }) => {
    return (
        <div className="items-list">
            {items.map((item, index) => (
                <div className="item-container" key={index}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default ItemsList;
