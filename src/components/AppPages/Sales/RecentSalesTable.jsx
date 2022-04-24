import React from 'react'
import Table from 'react-bootstrap/Table';

const RecentSalesTable = ({filterInvoices,invoices,getCustomer}) => {
  
  return (
    <Table responsive striped bordered hover variant="dark">
        <thead>
            <tr>
                <th>Ref</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Delivery Status</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Status</th>
            </tr>
        </thead>
        <tbody>
          {invoices.map((invoice)=>{
                return {...invoice,
                  customer_id: getCustomer(invoice.customer_id) ? getCustomer(invoice.customer_id).customer_name : 'NA'        
                }
              })
              .filter((invoice)=>(invoice.invoice_uid
              .includes(filterInvoices) | invoice.customer_id.toLowerCase()
              .includes(filterInvoices.toLowerCase())))
              .map((invoice)=>new Date(invoice.date).toLocaleDateString() === new Date().toLocaleDateString() && <tr key={invoice.invoice_id}>
            <td>{invoice.invoice_uid}</td>
            <td>{new Date(invoice.date).toLocaleDateString()}</td>
            <td>{invoice.customer_id}</td>
            <td>{invoice.delivery_status.toUpperCase()}</td>
            <td>{window.api.currency(invoice.grand_total)}</td>
            <td>{window.api.currency(invoice.payment_amount)}</td>
            <td>{window.api.currency(window.api.subtractCurrencies(invoice.grand_total,invoice.payment_amount))}</td>
            {invoice.payment_status === 1 && <td>PAID</td>}
            {invoice.payment_status === 2 && <td>PART</td>}
            {invoice.payment_status === 3 && <td>PENDING</td>}
          </tr>)}
        </tbody>
    </Table>
  )
}

export default RecentSalesTable;