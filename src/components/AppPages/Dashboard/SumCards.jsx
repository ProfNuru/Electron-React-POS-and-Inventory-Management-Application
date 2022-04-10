import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCreditCard, faDatabase, faMoneyBill1} from '@fortawesome/free-solid-svg-icons';


const SumCards = () => {
  return (
    <div className="sum-cards">
        <div className="cash-sales-sum">
            <div className="sums">
                <h6>Cash Sales</h6>
                <h3>GHS 0.00</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faMoneyBill1}></FontAwesomeIcon>
            </div>
        </div>
        <div className="credit-sales-sum">
            <div className="sums">
                <h6>Credit Sales</h6>
                <h3>GHS 0.00</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faCreditCard}></FontAwesomeIcon>
            </div>
        </div>
        <div className="inventory-sum">
            <div className="sums">
                <h6>Inventory</h6>
                <h3>In Stock: 0</h3>
                <h3>Sold: 0</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon>
            </div>
        </div>
    </div>
  )
}

export default SumCards