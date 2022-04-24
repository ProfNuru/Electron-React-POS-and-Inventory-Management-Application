import React,{useState} from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'
import Form from 'react-bootstrap/Form';

const YearlyRevenueLineChart = ({invoices}) => {
    const [plotDailyChecked,setPlotDailyChecked] = useState(true);
    const [plotMonthlyChecked,setPlotMonthlyChecked] = useState(false);

    const invoice_dates = invoices.map((invoice)=>new Date(invoice.date).toLocaleString('en-GB', 
                                    plotDailyChecked ?
                                    {
                                        day: 'numeric',
                                        month: 'short'
                                    }:
                                    {
                                        month: 'short'
                                    })).reverse();
    const invoice_values = invoices.map((invoice)=>invoice.grand_total).reverse();

    const uniqueDates = [...new Set(invoice_dates)]
    const datasetObjects = uniqueDates.map((date)=>{
        return {date:date,sales:0}
    })
    for(let i=0;i<datasetObjects.length;i++){
        for(let j=0;j<invoice_dates.length;j++){
            if(datasetObjects[i].date === invoice_dates[j]){
                datasetObjects[i].sales += invoice_values[j];
            }
        }
    }
    
    const chartData = {
        labels:datasetObjects.map((data)=>data.date),
        datasets:[{
            label:'Revenue',
            data:datasetObjects.map((data)=>data.sales),
            borderColor:'rgb(153,50,204)',
            backgroundColor:'rgb(153,50,204)',
            borderWidth:1
        }]

    }

    const handleDailyChecked = (e)=>{
        setPlotDailyChecked(e.target.checked);
        setPlotMonthlyChecked(false);
    }
    const handleMonthlyChecked = (e)=>{
        setPlotMonthlyChecked(e.target.checked);
        setPlotDailyChecked(false);
    }
    
  return (
    <div className='yearly-revenue-line-chart'>
        <div className='dashboardRevenueChartHeading'>
            <h3>Revenue</h3>
            <div>
                <h6>Total Revenue</h6>
                <h3>GHS {window.api.currency(invoice_values.reduce((sum,sale)=>window.api.addCurrencies(sum,sale),0))}</h3>
                <Form className='dailyMonthlyRadioBtns'>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`}>
                        <Form.Check
                            inline
                            label={` Plot Daily`}
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-1`}
                            checked={plotDailyChecked}
                            onChange={handleDailyChecked}
                        />
                        <Form.Check
                            inline
                            label={` Plot Monthly`}
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-2`}
                            checked={plotMonthlyChecked}
                            onChange={handleMonthlyChecked}
                        />
                        </div>
                    ))}
                </Form>
            </div>
            <div></div>
        </div>
        <Line data={chartData} />
    </div>
  )
}

export default YearlyRevenueLineChart;