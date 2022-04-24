import React from 'react';

import { Pie } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'

const ProductSalesBreakDown = ({sales, getItemFromID,colors}) => {
    const sales_items = sales.map((sale)=>getItemFromID(sale.item_id).item);
    const sales_value = sales.map((sale)=>window.api.multiplyCurrencies(sale.qty,sale.unit_price));

    const uniqueItems = [...new Set(sales_items)]
    
    const datasetObjects = uniqueItems.map((item)=>{
        return {item:item,value:0}
    })
    for(let i=0;i<datasetObjects.length;i++){
        for(let j=0;j<sales_items.length;j++){
            if(datasetObjects[i].item === sales_items[j]){
                datasetObjects[i].value = window.api.addCurrencies(datasetObjects[i].value,sales_value[j]);
            }
        }
    }
    
    const chartData = {
        labels:datasetObjects.map((data)=>data.item),
        datasets:[{
            label:'Sales',
            data:datasetObjects.map((data)=>data.value),
            backgroundColor:colors,
            
        }]

    }
    
  return (
    <div className='yearly-revenue-line-chart'>
        <h4>Sales Breakdown by Product</h4>
        <Pie data={chartData} />
    </div>
  )
}

export default ProductSalesBreakDown