import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { CustomersValueComponent } from '../Dashboard/CustomerValueSummary.style';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const Debtors = ({invoices,customers,pageNotification}) => {
    const [searchCustomer, setSearchCustomer] = useState('');
    const [invoiceIDToPay, setInvoiceIDToPay] = useState(0);
    const [paymentSuccess,setPaymentSuccess] = useState(false);
    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');
    const [paymentError,setPaymentError] = useState(false);
    const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
    const [paymentAmount,setPaymentAmount] = useState(0);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const onHidePaymentDialog = ()=>{
        setShowPaymentDialog(false);
    }

    const getCustomer = (custID)=>{
        for(let i=0; i<customers.length;i++){
            if(customers[i].customer_id === custID){
                return customers[i];
            }
        }
        return false;
    }
    const getInvoice = (invID)=>{
        for(let i=0; i<invoices.length;i++){
            if(invoices[i].invoice_id === invID){
                return invoices[i];
            }
        }
        return false;
    }

    const customer_invoices = invoices.map((invoice)=>{
      let customer = getCustomer(invoice.customer_id);
      return {...invoice,
                customer_name:customer ? customer.customer_name : 'NA',
                location: customer ? customer.address :'NA',
            }
    }).filter((inv)=>inv.customer_name.toLowerCase().includes(searchCustomer.toLowerCase()))
        .filter((inv)=>inv.grand_total-inv.payment_amount > 0);

    const total_sold = customer_invoices.reduce((sum,inv)=>window.api.addCurrencies(sum,inv.grand_total),0);
    const total_paid = customer_invoices.reduce((sum,inv)=>window.api.addCurrencies(sum,inv.payment_amount),0);
    const total_due = window.api.subtractCurrencies(total_sold,total_paid);
    
    const handleSearchCustomer = (e)=>{
        setSearchCustomer(e.target.value.trim());
    }

    const makePayment = (inv_id)=>{
        setInvoiceIDToPay(inv_id);
        setShowPaymentDialog(true);
    }

    const selectedInvoice = getInvoice(invoiceIDToPay);
    const submitPayment = ()=>{
        console.log("Pay",paymentAmount);
        let payment = {
            invoice:invoiceIDToPay,
            amount:window.api.addCurrencies(paymentAmount,selectedInvoice.payment_amount)
        }
        const feedback = window.api.insertNewData('pay-debt',payment);
        if(!feedback.success){
            setPaymentError(true)
            setPaymentErrorMessage(feedback.msg)
            setTimeout(()=>{
                setPaymentError(false)
                setPaymentErrorMessage('')
            },3000);
            return;
        }
        pageNotification(feedback);
        setShowPaymentDialog(false);
    }


    return (
        <CustomersValueComponent>
          <div className='customersValueHeading'>
              <div className='headingFilter'>
                  <h3>Pending Invoice Payments</h3>
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
                      <th>Action</th>
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
                    <td><Button variant='success' onClick={()=>makePayment(invoice.invoice_id)}>Make Payment</Button></td>
                </tr>)}
              </tbody>
          </Table>
          <Modal show={showPaymentDialog} onHide={onHidePaymentDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Payment for Invoice #{selectedInvoice.invoice_id} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Customer: {getCustomer(selectedInvoice.customer_id).customer_name}</h4>
                    <h4>Amount Due: {window.api.currency(window.api.subtractCurrencies(selectedInvoice.grand_total-selectedInvoice.payment_amount,paymentAmount))}</h4>
                    {paymentSuccess && <Alert variant='success'>{paymentSuccessMessage}</Alert>}
                    {paymentError && <Alert variant='danger'>{paymentErrorMessage}</Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="supplier-name">
                            <Form.Label>Enter Amount</Form.Label>
                            <Form.Control type="text" value={paymentAmount}
                                onChange={(e)=>setPaymentAmount(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHidePaymentDialog}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitPayment}>
                        Submit Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </CustomersValueComponent>
      )
}

export default Debtors