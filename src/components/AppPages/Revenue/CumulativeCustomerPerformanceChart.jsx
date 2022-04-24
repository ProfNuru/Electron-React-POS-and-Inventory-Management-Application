import React,{useState} from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import Form from 'react-bootstrap/Form';
import { CumulativeCustomerPerformance } from './CumulativeCustomerPerformanceChart.style';

const CumulativeCustomerPerformanceChart = ({customers,invoices}) => {
    const [plotPerSaleChecked,setPlotPerSaleChecked] = useState(false);
    const [plotDailyChecked,setPlotDailyChecked] = useState(true);
    const [plotMonthlyChecked,setPlotMonthlyChecked] = useState(false);
    const [plotYearlyChecked,setPlotYearlyChecked] = useState(false);

    const getCustomerFromID = (custID)=>{
        for(let i=0; i<customers.length;i++){
            if(customers[i].customer_id === custID){
                return customers[i];
            }
        }
        return false;
    }

    const inv_customers = invoices.map((invoice)=>{
        return invoice.customer_id   
    }).reverse();
    const inv_totals = invoices.map((invoice)=>{
            return invoice.grand_total;
    }).reverse();
    
    const revenue_dates = invoices.map((invoice)=>{
        if(plotPerSaleChecked){
            return new Date(invoice.date).toLocaleString('en-GB');
        }
        if(plotDailyChecked){
            return new Date(invoice.date).toLocaleString('en-GB',{
                day: 'numeric',
                month: 'short'
            });
        }
        if(plotMonthlyChecked){
            return new Date(invoice.date).toLocaleString('en-GB',{
                month: 'short'
            });
        }
        if(plotYearlyChecked){
            return new Date(invoice.date).toLocaleString('en-GB',{
                year: 'numeric'
            });
        }
        
    }).reverse();
    const uniqueCustomers = [...new Set(inv_customers)];
    const uniqueDates = [...new Set(revenue_dates)];
    const custDatasets = uniqueCustomers.map((customer_id)=>{
        return {
            customer: getCustomerFromID(customer_id) ? getCustomerFromID(customer_id).customer_name : 'Walk-in',
            dates:uniqueDates,
            totals:uniqueDates.map((date)=>{
                return inv_totals.filter((total,idx)=>date===revenue_dates[idx] & customer_id===inv_customers[idx]).reduce((s,t)=>s+t,0)
            }),
            cumTotal:uniqueDates.map((date)=>{
                return inv_totals.filter((total,idx)=>date===revenue_dates[idx] & customer_id===inv_customers[idx]).reduce((s,t)=>s+t,0)
            }).map((sum => value => sum += value)(0))
        }
    });

    const colors = custDatasets.map((item)=>{
        return `rgb(${Math.floor(Math.random() * (255 - custDatasets.length + 1) + custDatasets.length)},${Math.floor(Math.random() * (255 - custDatasets.length + 1) + custDatasets.length)},${Math.floor(Math.random() * (255 - custDatasets.length + 1) + custDatasets.length)})`
    })
    
    const chartData = {
        labels:uniqueDates,
        datasets:custDatasets.map((data,index)=>{
            return {
                label:data.customer,
                data:data.cumTotal,
                borderColor:colors[index],
                backgroundColor:colors[index],
                borderWidth:1,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
                barThickness: 15,                
            }
        })

    }

    const options = {
        maintainAspectRatio:false,
    }
    
    const handlePerSaleChecked = (e)=>{
        setPlotPerSaleChecked(e.target.checked);
        setPlotDailyChecked(false);
        setPlotMonthlyChecked(false);
        setPlotYearlyChecked(false);
    }
    const handleDailyChecked = (e)=>{
        setPlotPerSaleChecked(false);
        setPlotDailyChecked(e.target.checked);
        setPlotMonthlyChecked(false);
        setPlotYearlyChecked(false);
    }
    const handleMonthlyChecked = (e)=>{
        setPlotPerSaleChecked(false);
        setPlotDailyChecked(false);
        setPlotMonthlyChecked(e.target.checked);
        setPlotYearlyChecked(false);
    }
    const handleYearlyChecked = (e)=>{
        setPlotPerSaleChecked(false);
        setPlotDailyChecked(false);
        setPlotMonthlyChecked(false);
        setPlotYearlyChecked(e.target.checked);
    }

    return (
        <CumulativeCustomerPerformance>
            <div className='chartHead'>
                <h4>Cumulative Performance</h4>
                <Form className='togglePlotsBtns'>
                    <Form.Label>Toggle Revenue Chart Points</Form.Label>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`}>
                        <Form.Check
                            inline
                            label=" Per Sale"
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-1`}
                            checked={plotPerSaleChecked}
                            onChange={handlePerSaleChecked}
                        />
                        <Form.Check
                            inline
                            label=" Plot Daily"
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-2`}
                            checked={plotDailyChecked}
                            onChange={handleDailyChecked}
                        />
                        <Form.Check
                            inline
                            label=" Plot Monthly"
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-2`}
                            checked={plotMonthlyChecked}
                            onChange={handleMonthlyChecked}
                        />
                        <Form.Check
                            inline
                            label=" Plot Yearly"
                            name="plotPeriods"
                            type={type}
                            id={`inline-${type}-2`}
                            checked={plotYearlyChecked}
                            onChange={handleYearlyChecked}
                        />
                        </div>
                    ))}
                </Form>
            </div>
            <Line data={chartData} options={options} />
        </CumulativeCustomerPerformance>
    )
}

export default CumulativeCustomerPerformanceChart