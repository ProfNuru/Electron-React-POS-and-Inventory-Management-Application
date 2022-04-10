import React, {useState, useEffect} from 'react';

const DailySummaryComponent = () => {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);
  return (
    <div className='daily-summary'>
      <div className='daily-income'>
        <h6>Daily Income</h6>
        <h1>GHS 0.00</h1>
      </div>
      <div className='current-datetime'>
        <h1>{dateState.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}</h1>
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