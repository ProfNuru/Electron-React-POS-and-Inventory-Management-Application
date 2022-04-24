import React, { Component } from 'react';
import {DashboardStyle} from './DashboardComponent.style';
import DailySummaryComponent from './DailySummaryComponent';
import SumCards from './SumCards';
import YearlyRevenueLineChart from './YearlyRevenueLineChart';
import ProductSalesBreakDown from './ProductSalesPieChart';
import ProductQuantitySold from './ProductQuantitySold';
import CustomersValueSummary from './CustomersValueSummary';

export class DashboardComponent extends Component {
  
  getItemFromID = (itemID)=>{
    for(let i=0; i<this.props.all_items.length;i++){
      if(this.props.all_items[i].item_id === itemID){
        return this.props.all_items[i];
      }
    }
    return false;
  }

  getCustomerFromID = (custID)=>{
    for(let i=0; i<this.props.customers.length;i++){
      if(this.props.customers[i].customer_id === custID){
        return this.props.customers[i];
      }
    }
    return false;
  }

  render() {
    const uniqueItems = [...new Set(this.props.all_sales.map((sale)=>sale.item_id))]
    const colors = uniqueItems.map((item)=>{
        return `rgb(${Math.floor(Math.random() * (255 - uniqueItems.length + 1) + uniqueItems.length)},${Math.floor(Math.random() * (255 - uniqueItems.length + 1) + uniqueItems.length)},${Math.floor(Math.random() * (255 - uniqueItems.length + 1) + uniqueItems.length)})`
    })
    return (
      <DashboardStyle visible={this.props.visibility}>
          <DailySummaryComponent currentYearInvoices={this.props.invoices.filter((invoice)=>new Date(invoice.date).getFullYear()===new Date().getFullYear())}
                                 previousYearInvoices={this.props.invoices.filter((invoice)=>new Date(invoice.date).getFullYear()===new Date().getFullYear()-1)} />
          <div className="dashboard-content">
            <div className="dashboard-main">
              <SumCards currentYearInvoices={this.props.invoices.filter((invoice)=>new Date(invoice.date).getFullYear()===new Date().getFullYear())}
                        previousYearInvoices={this.props.invoices.filter((invoice)=>new Date(invoice.date).getFullYear()===new Date().getFullYear()-1)} />
              
              <YearlyRevenueLineChart invoices={this.props.invoices.filter((invoice)=>new Date(invoice.date).getFullYear()===new Date().getFullYear())} />
              <CustomersValueSummary invoices={this.props.invoices} getCustomer={this.getCustomerFromID} />
            </div>
            <div className="dashboard-side">
              <ProductSalesBreakDown sales={this.props.all_sales} 
                                    getItemFromID={this.getItemFromID}
                                    colors={colors} />
              <ProductQuantitySold sales={this.props.all_sales} 
                                    getItemFromID={this.getItemFromID}
                                    colors={colors} />
              
            </div>
          </div>
      </DashboardStyle>
    )
  }
}

export default DashboardComponent