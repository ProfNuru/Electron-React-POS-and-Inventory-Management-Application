import React from 'react';

import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'

const ProductQuantitySold = ({sales, getItemFromID,colors}) => {
    const sales_items = sales.map((sale)=>getItemFromID(sale.item_id).item);
    const sales_qty = sales.map((sale)=>sale.qty);

    const uniqueItems = [...new Set(sales_items)]
    
    const datasetObjects = uniqueItems.map((item)=>{
        return {item:item,qty:0}
    })
    for(let i=0;i<datasetObjects.length;i++){
        for(let j=0;j<sales_items.length;j++){
            if(datasetObjects[i].item === sales_items[j]){
                datasetObjects[i].qty += sales_qty[j];
            }
        }
    }
    
    const chartData = {
        labels:datasetObjects.map((data)=>data.item),
        datasets:[{
            label:'Quantity Sold',
            data:datasetObjects.map((data)=>data.qty),
            backgroundColor:colors,
            
        }]

    }
    
  return (
    <div className='yearly-revenue-line-chart'>
        <h4>Top Selling Products</h4>
        <Bar data={chartData} options={{plugins: {
            legend: {
                display: false
            }
        }}} />
    </div>
  )
}

export default ProductQuantitySold