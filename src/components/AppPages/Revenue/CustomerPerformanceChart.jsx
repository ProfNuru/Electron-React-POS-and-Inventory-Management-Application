import React from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import { CustomerPerformanceChartComponent } from './CustomerPerformanceChart.style';

const CustomerPerformanceChart = ({invoices,customers}) => {
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
    const inv_cash_totals = invoices.map((invoice)=>{
            if(invoice.payment_status===1){
                return invoice.grand_total;
            }
            return 0;
        }).reverse();
    const inv_credit_totals = invoices.map((invoice)=>{
            if(invoice.payment_status!==1){
                return invoice.grand_total;
            }
            return 0;
        }).reverse();
    const inv_payments = invoices.map((invoice)=>{
            if(invoice.payment_status!==1){
                return invoice.payment_amount;
            }
            return 0;
        }).reverse();

    const uniqueCustomers = [...new Set(inv_customers)];
    const revenueObjects = uniqueCustomers.map((customer)=>{
        return {customer_id:customer,cash_total:0,credit_total:0,credit_payments:0}
    });
    for(let i=0;i<revenueObjects.length;i++){
        for(let j=0;j<inv_customers.length;j++){
            if(revenueObjects[i].customer_id === inv_customers[j]){
                revenueObjects[i].cash_total += inv_cash_totals[j];
                revenueObjects[i].credit_total += inv_credit_totals[j];
                revenueObjects[i].credit_payments += inv_payments[j];                
            }
        }
    }
    
    
    const chartData = {
        labels:revenueObjects.map((data)=>data.customer_id===0 ? 'Walk-in' : getCustomerFromID(data.customer_id).customer_name),
        datasets:[{
            label:'Cash Transactions',
            data:revenueObjects.map((data)=>data.cash_total),
            borderColor:'rgb(103,0,115)',
            backgroundColor:'rgb(103,0,115)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:1
        },
        {
            label:'Credit Transactions',
            data:revenueObjects.map((data)=>data.credit_total),
            borderColor:'rgb(255,97,0)',
            backgroundColor:'rgb(255,97,0)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:2
        },
        {
            label:'Paid Credits',
            data:revenueObjects.map((data)=>data.credit_payments),
            borderColor:'rgb(50,50,150)',
            backgroundColor:'rgb(50,50,150)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:3
        }]

    }

    const options = {
        maintainAspectRatio:false,
        indexAxis: 'y',
    }

  return (
    <CustomerPerformanceChartComponent>
        <div className='chartHead'>
            <h2>Customer Performance</h2>
        </div>
        <Bar data={chartData} options={options} />
    </CustomerPerformanceChartComponent>
  )
}

export default CustomerPerformanceChart;