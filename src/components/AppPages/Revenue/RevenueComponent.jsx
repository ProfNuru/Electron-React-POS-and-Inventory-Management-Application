import React from 'react';
import { RevenueContainer } from './RevenueComponent.style';
import IncomeStatementChart from './IncomeStatementChart';
import CustomerPerformanceChart from './CustomerPerformanceChart';
import CumulativeCustomerPerformanceChart from './CumulativeCustomerPerformanceChart';
import Table from 'react-bootstrap/Table';

const RevenueComponent = ({customers,invoices, all_sales, visibility}) => {
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

  return (
    <RevenueContainer visible={visibility}>
      <div className='income-statement-chart'>
        <IncomeStatementChart invoices={invoices} sales={all_sales} items={all_sales} />
      </div>
      <div className='customer-performance-chart'>
        <CustomerPerformanceChart customers={customers} invoices={invoices} />
      </div>
      <div className='customer-dataset'>
        <Table responsive striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Total Cash Transactions</th>
                    <th>Total Credit Transactions</th>
                    <th>Total Paid Transactions</th>
                </tr>
            </thead>
            <tbody>
                {revenueObjects.map((obj)=><tr key={obj.customer_id}>
                    <td>{obj.customer_id}</td>
                    <td>{obj.customer_id===0 ? 'Walk-in' : getCustomerFromID(obj.customer_id).customer_name}</td>
                    <td>{obj.cash_total}</td>
                    <td>{obj.credit_total}</td>
                    <td>{obj.credit_payments}</td>
                </tr>)}
            </tbody>
        </Table>
      </div>
      <div className='cumulative-customer-performance'>
        <CumulativeCustomerPerformanceChart customers={customers} invoices={invoices} />
      </div>
    </RevenueContainer>
  )
}

export default RevenueComponent;
