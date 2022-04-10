import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCreditCard, faDatabase, faMoneyBill1} from '@fortawesome/free-solid-svg-icons';

const InvCards = () => {
  return (
    <div className="inv-cards">
        <div className="inventory-sum">
            <div className="sums">
                <h3>In Stock: 0</h3>
                <h3>Out of Stock: 0</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon>
            </div>
        </div>
        <div className="stock-sum">
            <div className="sums">
                <h6>Total Amount in Stock</h6>
                <h3>GHS 0.00</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon>
            </div>
        </div>
        <div className="credit-sales-sum">
            <div className="sums">
                <h6>Total Purchases</h6>
                <h3>GHS 0.00</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon>
            </div>
        </div>

    </div>
  )
}

export default InvCards