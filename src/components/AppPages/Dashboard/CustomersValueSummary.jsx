import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { CustomersValueComponent } from './CustomerValueSummary.style';

const CustomersValueSummary = ({invoices,getCustomer}) => {
    const [searchCustomer, setSearchCustomer] = useState('');

    const customer_invoices = invoices.map((invoice)=>{
      let customer = getCustomer(invoice.customer_id);
      return {...invoice,
                customer_name:customer ? customer.customer_name : 'NA',
                location: customer ? customer.address :'NA',
            }
    }).filter((inv)=>inv.customer_name.toLowerCase().includes(searchCustomer.toLowerCase()));

    const total_sold = customer_invoices.reduce((sum,inv)=>window.api.addCurrencies(sum,inv.grand_total),0);
    const total_paid = customer_invoices.reduce((sum,inv)=>window.api.addCurrencies(sum,inv.payment_amount),0);
    const total_due = window.api.subtractCurrencies(total_sold,total_paid);
    
    const handleSearchCustomer = (e)=>{
        setSearchCustomer(e.target.value.trim());
    }

    return (
        <CustomersValueComponent>
          <div className='customersValueHeading'>
              <div className='headingFilter'>
                  <h3>Sales By Customers</h3>
                  <Form.Control type="text" placeholder="Search Customer" 
                    value={searchCustomer} 
                    onChange={handleSearchCustomer} />
              </div>
              <div className='customerTotals'>
                  <h4 className='total-sale'>Total Sale: {window.api.currency(total_sold)}</h4>
                  <h4 className='total-paid'>Total Paid: {window.api.currency(total_paid)}</h4>
                  <h4 className='total-due'>Total Due: {window.api.currency(total_due)}</h4>
              </div>
          </div>
          <Table responsive striped bordered hover variant="dark">
              <thead>
                  <tr>
                      <th>Invoice ID</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Invoice Date</th>
                      <th>Invoice Type</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Amount Due</th>
                  </tr>
              </thead>
              <tbody>
                {customer_invoices.map((invoice)=><tr key={invoice.invoice_id}>
                    <td>{invoice.invoice_id}</td>
                    <td>{invoice.customer_name}</td>
                    <td>{invoice.location}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    {invoice.payment_status === 1  && <td>CASH</td>}
                    {invoice.payment_status !== 1 && <td>CREDIT</td>}
                    <td>{window.api.currency(invoice.grand_total)}</td>
                    <td>{window.api.currency(invoice.payment_amount)}</td>
                    <td>{window.api.currency(window.api.subtractCurrencies(invoice.grand_total,invoice.payment_amount))}</td>
                </tr>)}
              </tbody>
          </Table>
        </CustomersValueComponent>
      )
}

export default CustomersValueSummary