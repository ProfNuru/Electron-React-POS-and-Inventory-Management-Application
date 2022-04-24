import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import { Bar,Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import { IncomeStatementChartComponent } from './IncomeStatementChart.style';

const IncomeStatementChart = ({invoices,sales}) => {
    const [plotPerSaleChecked,setPlotPerSaleChecked] = useState(false);
    const [plotDailyChecked,setPlotDailyChecked] = useState(true);
    const [plotMonthlyChecked,setPlotMonthlyChecked] = useState(false);
    const [plotYearlyChecked,setPlotYearlyChecked] = useState(false);

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
    const revenue_amounts = invoices.map((invoice)=>invoice.sub_total).reverse();
    const cost_of_goods_sold = invoices.map((invoice)=>{
        let invoice_cost = sales.filter((sale)=>{
            return sale.invoice_id === invoice.invoice_id;
        }).reduce((sum,cost)=>window.api.addCurrencies(sum,window.api.multiplyCurrencies(cost.qty,cost.cost_price)),0)
            return invoice_cost;
    }).reverse();
    const other_costs = invoices.map((invoice)=>window.api.addCurrencies(invoice.shipping,window.api.addCurrencies(invoice.discount,invoice.taxValue))).reverse();    
    
    const uniqueDates = [...new Set(revenue_dates)];
    const revenueObjects = uniqueDates.map((date)=>{
        return {date:date,sales:0,cost_of_goods:0,other_costs:0,net_profit_margin:0}
    });
    for(let i=0;i<revenueObjects.length;i++){
        for(let j=0;j<revenue_dates.length;j++){
            if(revenueObjects[i].date === revenue_dates[j]){
                revenueObjects[i].sales += revenue_amounts[j];
                revenueObjects[i].cost_of_goods += cost_of_goods_sold[j];
                revenueObjects[i].other_costs += other_costs[j];
                try{
                    revenueObjects[i].net_profit_margin 
                    += ((revenue_amounts[j]-cost_of_goods_sold[j]-other_costs[j])/revenue_amounts[j])*100;
                }catch{
                    revenueObjects[i].net_profit_margin += 0;
                }
                
            }
        }
    }
    
    const chartData = {
        labels:revenueObjects.map((data)=>data.date),
        datasets:[{
            label:'Revenue',
            yAxisID: 'A',
            data:revenueObjects.map((data)=>data.sales),
            borderColor:'rgb(103,0,115)',
            backgroundColor:'rgb(103,0,115)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:2
        },
        {
            label:'Cost of Goods Sold',
            yAxisID: 'A',
            data:revenueObjects.map((data)=>data.cost_of_goods),
            borderColor:'rgb(255,97,0)',
            backgroundColor:'rgb(255,97,0)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:3
        },
        {
            label:'Other Costs (Shipping + Discounts + Taxes)',
            yAxisID: 'A',
            data:revenueObjects.map((data)=>data.other_costs),
            borderColor:'rgb(255,0,0)',
            backgroundColor:'rgb(255,0,0)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            barThickness: 15,
            order:4
        },
        {
            type:'line',
            label:'Net Profit Margin (%)',
            yAxisID: 'B',
            data:revenueObjects.map((data)=>data.net_profit_margin),
            borderColor:'rgb(0,0,0)',
            backgroundColor:'rgb(0,0,0)',
            borderWidth:1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            order:1
        }]

    }

    const options = {
        maintainAspectRatio:false,
        scales: {
            A: {
                type: 'linear',
                position: 'left',
            },
            B: {
                type: 'linear',
                position: 'right',
                ticks: {
                    max: 100,
                    min: 0
                }
            }
        }

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
    <IncomeStatementChartComponent>
        <div className='chartHead'>
            <h2>Revenue Summary</h2>
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
        <Bar data={chartData} options={options} />
    </IncomeStatementChartComponent>
  )
}

export default IncomeStatementChart;