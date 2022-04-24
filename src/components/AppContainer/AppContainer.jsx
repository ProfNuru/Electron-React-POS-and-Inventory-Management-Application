import React, { Component } from 'react';
import { AppWrapper } from './AppContainer.style';
import Sidebar from "../SideNavigation/SideBar";
import DashboardComponent from '../AppPages/Dashboard/DashboardComponent';
import InventoryComponent from '../AppPages/Inventory/InventoryComponent';
import Suppliers from '../AppPages/Suppliers/Suppliers';
import Customers from '../AppPages/Customers/Customers';
import Sales from '../AppPages/Sales/Sales';
import RevenueComponent from '../AppPages/Revenue/RevenueComponent';

export class AppContainer extends Component {
  constructor(){
    super();
    this.state = {
      saved_settings:{},
      pagesDisplayed: {
        showDashboard:true,
        showPos:false,
        showInventory:false,
        showSuppliers:false,
        showSales:false,
        showCustomers:false,
        showSettings:false,
      },
      items:[],
      customers:[],
      sales:[],
      invoices:[],
      payment_statuses:[],
      cart:[],
      purchases:[],
      suppliers:[],
      paid_debts:[]
    }
  }

  toggleWindow = (showKey)=>{
    let newState = Object.fromEntries(Object.keys(this.state.pagesDisplayed).map((key) => {
      if(key===showKey){
        return [key, true]
      }
      return [key, false]
    }));
    
    this.setState({
      pagesDisplayed:newState
    });
  }

  getStatesData = ()=>{
    const items = window.api.sendAsynchronousIPC('get-all-items');
    this.setState({
      items:items.data,
    });

    const suppliers = window.api.sendAsynchronousIPC('get-all-suppliers');
    this.setState({
        suppliers:suppliers.data,
    });

    const purchases = window.api.sendAsynchronousIPC('get-all-purchases');
    this.setState({
        purchases:purchases.data,
    });

    const payment_statuses = window.api.sendAsynchronousIPC('get-all-payment-statuses');
    this.setState({
        payment_statuses:payment_statuses.data,
    });
    
    const customers = window.api.sendAsynchronousIPC('get-all-customers');
    this.setState({
        customers:customers.data,
    });

    
    const all_invoices = window.api.sendAsynchronousIPC('get-all-invoices');
    this.setState({
        invoices:all_invoices.data,
    });
    
    const all_sales = window.api.sendAsynchronousIPC('get-all-sales');
    this.setState({
        sales:all_sales.data,
    });
  }

  componentDidMount() {
    this.getStatesData();
  }

  render() {
    return (
      <AppWrapper>
          <Sidebar pagesShown={this.state.pagesDisplayed} toggleWindows = {this.toggleWindow} />
          <div id="app-pages">
            {/* {this.state.pagesDisplayed.showDashboard && <DashboardComponent />}
            {this.state.pagesDisplayed.showInventory && <InventoryComponent />} */}
            <DashboardComponent all_items={this.state.items} invoices={this.state.invoices}
            all_sales={this.state.sales} customers={this.state.customers}
            visibility={this.state.pagesDisplayed.showDashboard} />
            <Sales reloadData={this.getStatesData} payment_statuses={this.state.payment_statuses} 
                sales={this.state.sales} items={this.state.items} customers={this.state.customers} 
                invoices={this.state.invoices}
                visibility={this.state.pagesDisplayed.showPos} />
            <InventoryComponent reloadData={this.getStatesData} purchases={this.state.purchases} 
                suppliers={this.state.suppliers} all_items={this.state.items} visibility={this.state.pagesDisplayed.showInventory} />
            <Suppliers reloadData={this.getStatesData} visibility={this.state.pagesDisplayed.showSuppliers} />
            <Customers reloadData={this.getStatesData} invoices={this.state.invoices}
                customers={this.state.customers}
                visibility={this.state.pagesDisplayed.showCustomers} />
            
            <RevenueComponent all_items={this.state.items} invoices={this.state.invoices}
            all_sales={this.state.sales} customers={this.state.customers}
            visibility={this.state.pagesDisplayed.showSales} />

          </div>
      </AppWrapper>
    )
  }
}

export default AppContainer;