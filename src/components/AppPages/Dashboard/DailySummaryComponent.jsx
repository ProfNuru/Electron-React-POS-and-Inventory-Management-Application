import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';

const DailySummaryComponent = ({currentYearInvoices,previousYearInvoices}) => {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  const currentYearRevenue = currentYearInvoices.reduce((sum,invoice)=>{
    return window.api.addCurrencies(sum,invoice.grand_total)
  },0);

  const previousYearRevenue = previousYearInvoices.reduce((sum,invoice)=>{
    return window.api.addCurrencies(sum,invoice.grand_total)
  },0);

  const yearlyChangeInRevenue = window.api.subtractCurrencies(currentYearRevenue,previousYearRevenue);
  // console.log(previousYearRevenue,yearlyChangeInRevenue);

  return (
    <div className='daily-summary'>
      <div className='daily-income'>
        <h6>Total Revenue ({new Date().getFullYear()})</h6>
        <h2>
          GHS {window.api.currency(currentYearRevenue)}
          <span className='revenueChange'>
            { 
              yearlyChangeInRevenue >= 0 ?
              <span className='changeIncrease'><FontAwesomeIcon icon={faArrowUp} /> {window.api.currency(Math.abs(yearlyChangeInRevenue))}</span> :
              <span className='changeDecrease'><FontAwesomeIcon icon={faArrowDown} /> {window.api.currency(Math.abs(yearlyChangeInRevenue))}</span>
            }
          </span>
        </h2>
      </div>
      <div className='current-datetime'>
        <h2>{dateState.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}</h2>
        <h4>{dateState.toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: 'numeric',
                    hour12: true,
                    second: '2-digit',
                })}</h4>
      </div>
    </div>
  )
}

export default DailySummaryComponent;