import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPrint,faBroom} from '@fortawesome/free-solid-svg-icons';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const CartExtras = ({handleDiscount,handleTax,handleShipping,
                    handleNote,paymentStatuses,resetCart,
                    handleDelivery,handlePayment,handleCheckout,
                    handlePaymentAmt,getPaymentStatus,paymentAmt,
                    grandtotal}) => {
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [deliveryStatus, setDeliveryStatus] = useState(1);
    const [paymentStatus, setPaymentStatus] = useState(3);
    const [saleNote, setSaleNote] = useState('');
    const [paymentAmount,setPaymentAmount] = useState(paymentAmt);

    const paymentFieldEvent=(e)=>{
        setPaymentAmount(e.target.value);
        handlePaymentAmt(e.target.value);

    }

    const discountFieldEvent=(e)=>{
        setDiscount(e.target.value);
        handleDiscount(e.target.value);
    }

    const taxFieldEvent=(e)=>{
        setTax(e.target.value);
        handleTax(e.target.value);
    }

    const shippingFieldEvent=(e)=>{
        setShipping(e.target.value);
        handleShipping(e.target.value);
    }
    const noteFieldEvent=(e)=>{
        setSaleNote(e.target.value);
        handleNote(e.target.value);
    }

    const paymentStatusFieldEvent=(e)=>{
        setPaymentStatus(parseInt(e.target.value));
        handlePayment(parseInt(e.target.value))
    }

    const deliveryStatusFieldEvent=(e)=>{
        setDeliveryStatus(parseInt(e.target.value));
        handleDelivery(parseInt(e.target.value))
    }

    const checkoutSale=()=>{
        handleCheckout();
        setPaymentAmount(0);
    }

    const clearCart=()=>{
        
        setDiscount(0);
        handleDiscount(0);
        setTax(0);
        handleTax(0);
        setShipping(0);
        handleShipping(0);
        setSaleNote('');
        handleNote('');
        setPaymentStatus(1);
        setPaymentAmount(0);
        setDeliveryStatus(1);
        resetCart();
    }

  return (
    <div className="cartExtras">
        <Form.Group controlId="salesPayment" id='editPaymentFormField'>
            <Form.Label>Payment</Form.Label>
            <InputGroup>
            <InputGroup.Text id="sales-currency">GHC</InputGroup.Text>
            <FormControl
                placeholder="0.00"
                aria-label="sales-currency"
                aria-describedby="sales-currency"
                value={paymentAmount}
                onChange={paymentFieldEvent}
            />
            </InputGroup>
        </Form.Group>

        <Form.Group controlId="salesDiscount" id='editDiscountFormField'>
            <Form.Label>Discount</Form.Label>
            <InputGroup>
            <InputGroup.Text id="sales-currency">GHC</InputGroup.Text>
            <FormControl
                placeholder="0.00"
                aria-label="sales-currency"
                aria-describedby="sales-currency"
                value={discount}
                onChange={discountFieldEvent}
            />
            </InputGroup>
        </Form.Group>

        <Form.Group controlId="salesTax" id='editTaxFormField'>
            <Form.Label>Tax</Form.Label>
            <InputGroup>
            <FormControl
                placeholder="0.00"
                aria-label="Sales Tax"
                aria-describedby="tax-percentage"
                value={tax}
                onChange={taxFieldEvent}
            />
            <InputGroup.Text id="tax-percentage">%</InputGroup.Text>
            </InputGroup>
        </Form.Group>
        
        <Form.Group controlId="salesShipping" id='editShippingFormField'>
            <Form.Label>Shipping</Form.Label>
            <InputGroup>
            <InputGroup.Text id="shipping-cost">GHC</InputGroup.Text>
            <FormControl
                placeholder="0.00"
                aria-label="shipping-cost"
                aria-describedby="shipping-cost"
                value={shipping}
                onChange={shippingFieldEvent}
            />
            </InputGroup>
        </Form.Group>
        
        <Form.Group controlId="salesStatus" id='editSalesStatusFormField'>
            <Form.Label>Delivery Status</Form.Label>
            <Form.Select aria-label="Select Item to purchase" value={deliveryStatus} onChange={deliveryStatusFieldEvent}>
                <option value={0}>::CHOOSE DELIVERY STATUS::</option>
                <option value={1}>delivered</option>
                <option value={2}>ordered</option>
            </Form.Select>
        </Form.Group>
        
        <div id='editPaymentStatusFormField'></div>

        {/* <Form.Group controlId="salesPaymentStatus" id='editPaymentStatusFormField'>
            <Form.Label>Payment Status</Form.Label>
            <Form.Select aria-label="Select payment status" value={paymentStatus} 
            onChange={paymentStatusFieldEvent} disabled>
                <option value={0}>::CHOOSE PAYMENT STATUS::</option>
                {paymentStatuses.map((status)=><option key={status.payment_status_id} value={status.payment_status_id}>
                    {status.payment_status}
                </option>)}
            </Form.Select>
        </Form.Group> */}

        <Button variant="success" size="lg" id='checkoutCompleteSaleBtn'><FontAwesomeIcon icon={faPrint} onClick={checkoutSale} /> Print Invoice</Button>
        <Button variant="danger" size="lg" id='clearSaleBtn'><FontAwesomeIcon icon={faBroom} onClick={clearCart} /> Clear</Button>
    </div>
        
  )
}

export default CartExtras