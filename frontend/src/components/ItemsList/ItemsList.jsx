import React from 'react';
import './ItemsList.css';

const ItemsList = ({ items }) => {
    return (
        <div className="items-list">
            {items.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto'}}>
                        No hay elementos
                </div>
            ) : (
                items.map((item, index) => (
                    <div className="item-container" key={index}>
                        {item}
                    </div>
                ))
            )}
        </div>
    );
};

export default ItemsList;
