import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowUp, faFileInvoiceDollar, faHandHoldingDollar, faMoneyBillWave} from '@fortawesome/free-solid-svg-icons';


const SumCards = ({currentYearInvoices,previousYearInvoices}) => {
    const currentYearCashSales = currentYearInvoices.filter((invoice)=>invoice.payment_status===1)
        .reduce((sum,sale)=>{
        return window.api.addCurrencies(sum,sale.grand_total)
    },0)

    const previousYearCashSales = previousYearInvoices.filter((invoice)=>invoice.payment_status===1)
        .reduce((sum,sale)=>{
        return window.api.addCurrencies(sum,sale.grand_total)
    },0)

    const yearlyChangeInCashSales = window.api.subtractCurrencies(currentYearCashSales, previousYearCashSales);

    const currentYearCreditSales = currentYearInvoices.filter((invoice)=>invoice.payment_status!==1)
        .reduce((sum,sale)=>{
        return window.api.addCurrencies(sum,sale.grand_total)
    },0)

    const previousYearCreditSales = previousYearInvoices.filter((invoice)=>invoice.payment_status!==1)
        .reduce((sum,sale)=>{
        return window.api.addCurrencies(sum,sale.grand_total)
    },0)

    const yearlyChangeInCreditSales = window.api.subtractCurrencies(currentYearCreditSales, previousYearCreditSales);

    const currentYearPaidCreditSales = currentYearInvoices.filter((invoice)=>invoice.payment_status!==1)
        .reduce((sum,sale)=>{
        return window.api.addCurrencies(sum, sale.payment_amount)
    },0)
    
  return (
    <div className="sum-cards">
        <div className="cash-sales-sum">
            <div className="sums">
                <h6>Cash Sales</h6>
                <h3>GHS {window.api.currency(currentYearCashSales)} 
                    <div>
                        { 
                            yearlyChangeInCashSales >= 0 ?
                            <span className='changeIncrease'><FontAwesomeIcon icon={faArrowUp} /> {window.api.currency(Math.abs(yearlyChangeInCashSales))}</span> :
                            <span className='changeDecrease'><FontAwesomeIcon icon={faArrowDown} /> {window.api.currency(Math.abs(yearlyChangeInCashSales))}</span>
                        }
                    </div>
                </h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faMoneyBillWave}></FontAwesomeIcon>
            </div>
        </div>
        <div className="credit-sales-sum">
            <div className="sums">
                <h6>Credit Sales</h6>
                <h3>GHS {window.api.currency(currentYearCreditSales)} 
                    <div>
                        { 
                            yearlyChangeInCreditSales >= 0 ?
                            <span className='changeIncrease'><FontAwesomeIcon icon={faArrowUp} /> {window.api.currency(Math.abs(yearlyChangeInCreditSales))}</span> :
                            <span className='changeDecrease'><FontAwesomeIcon icon={faArrowDown} /> {window.api.currency(Math.abs(yearlyChangeInCreditSales))}</span>
                        }
                    </div>
                </h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faFileInvoiceDollar}></FontAwesomeIcon>
            </div>
        </div>
        <div className="inventory-sum">
        <div className="sums">
                <h6>Paid Credits</h6>
                <h3>GHS {window.api.currency(currentYearPaidCreditSales)}</h3>
            </div>
            <div className="sum-icon">
                <FontAwesomeIcon icon={faHandHoldingDollar}></FontAwesomeIcon>
            </div>
        </div>
    </div>
  )
}

export default SumCards