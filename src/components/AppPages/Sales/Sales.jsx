import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import { PageTitle } from '../../AppContainer/PageTitle.style';
import { SalesPage } from './Sales.style';
import CartExtras from './CartExtras';
import ThermalPrintingTemplate from './ThermalPrintingTemplate';
import A4PrintingTemplate from './A4PrintingTemplate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping,faTrash,faPlus,faMinus, faPrint } from '@fortawesome/free-solid-svg-icons';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import RecentSalesTable from './RecentSalesTable';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

export class Sales extends Component {
  constructor(){
    super();

    this.state = {
      searchItemValue:'',
      selectedCustomer:0,
      cartItems:[],
      toggleItemsSales:true,
      subtotal:window.api.currency(0),
      grandTotal:window.api.currency(0),
      discount:0,
      tax:0.00,
      taxValue:window.api.currency(0),
      shipping:window.api.currency(0),
      saleStatus:1,
      paymentStatus:1,
      saleNote:'',
      extrasError:false,
      extrasSuccess:false,
      extrasErrorMsg:'',
      extrasSuccessMsg:'',
      showPrintModal:false,
      printSize:'a4',
      invoiceUID:''
    }
  }

  getItem = (itemID)=>{
    for(var i=0;i<this.props.items.length; i++){
      if(this.props.items[i].item_id === itemID){
        let selectedItem = this.props.items[i]
        selectedItem = {...selectedItem,qty:1}
        return selectedItem;
      }
    }
  }

  getCustomer = (customerID)=>{
    if(customerID > 0){
      for(var i=0;i<this.props.customers.length; i++){
        if(this.props.customers[i].customer_id === customerID){
          let selectedCustomer= this.props.customers[i]
          return selectedCustomer;
        }
      }
    }
  }
  
  getCurrentCustomer = ()=>{
    if(this.state.selectedCustomer > 0){
      for(var i=0;i<this.props.customers.length; i++){
        if(this.props.customers[i].customer_id === this.state.selectedCustomer){
          let selectedCustomer= this.props.customers[i]
          return selectedCustomer;
        }
      }
    }
  }

  itemInCart = (itemID)=>{
    for(var i=0;i<this.state.cartItems.length; i++){
      if(this.state.cartItems[i].item_id === itemID){
        return true;
      }
    }
    return false;
  }

  addItemTocart = (itemID)=>{
    let item = this.getItem(itemID);
    if(!item){
      console.log("Item does not exist");
      return;
    }
    if(this.itemInCart(itemID)){
      console.log("Item already in cart");
      return;
    }
    this.setState({
      cartItems:[...this.state.cartItems,item]
    },()=>this.calculateTotals());
  }

  cartItemQtyChanged = (e,item_id)=>{
    let qtyValue = e.target.value;
    if(!isNaN(qtyValue)){
      this.setState({
        cartItems:this.state.cartItems.map((item)=>item.item_id === item_id ? {...item,qty:qtyValue} : {...item})
      },()=>this.calculateTotals())
    }
  }

  decreaseQty = (itemID)=>{
    this.setState({
      cartItems:this.state.cartItems.map((item)=>item.item_id === itemID ? {...item,qty:item.qty > 0 ? item.qty - 1 : 0} : {...item})
    },()=>this.calculateTotals())
  }

  increaseQty = (itemID)=>{
    this.setState({
      cartItems:this.state.cartItems.map((item)=>item.item_id === itemID ? {...item,qty:item.available_qty > item.qty ? item.qty + 1 : item.available_qty} : {...item})
    },()=>this.calculateTotals())
  }

  removeFromCart = (itemID)=>{
    this.setState({
      cartItems:this.state.cartItems.filter((item)=>item.item_id !== itemID)
    },()=>this.calculateTotals())
  }

  handleSelectCustomer = (e)=>{
    this.setState({
      selectedCustomer:parseInt(e.target.value)
    })
  }

  handleDiscountField = (value)=>{
    this.setState({
      discount:window.api.currency(value)
    },()=>this.calculateTotals());
  }

  handleTaxField = (value) => {
    let taxPercent = parseFloat(value)
    if(!isNaN(taxPercent)){
      this.setState({
        tax:taxPercent
      },()=>this.calculateTotals())
    }else{
      this.setState({
        tax:0,
        extrasError:true,
        extrasErrorMsg:'Invalid input for tax'
      },()=>this.calculateTotals())
      setTimeout(()=>{
        this.setState({
          extrasError:false,
          extrasErrorMsg:''
        })
      },3000)
    }
  }

  handleShippingField = (value)=>{
    this.setState({
      shipping:window.api.currency(value)
    },()=>this.calculateTotals());
  }

  handleNoteField = (value)=>{
    this.setState({
      saleNote:value.trim()
    });
  }
  

  handleDeliveryStatusField = (value)=>{
    this.setState({
      saleStatus:parseInt(value)
    });
  }

  handlePaymentStatusField = (value)=>{
    this.setState({
      paymentStatus:parseInt(value)
    });
  }

  calculateTotals = ()=>{
    let subTotal = this.state.cartItems.reduce((total,nextItem)=>window.api.addCurrencies(total, window.api.multiplyCurrencies(nextItem.qty,nextItem.selling_unit_price)),0)
    let taxValue = window.api.multiplyCurrencies(this.state.tax/100, subTotal);
    let grandTotal = window.api.subtractCurrencies(subTotal,this.state.discount);
    grandTotal = window.api.addCurrencies(grandTotal,taxValue);
    grandTotal = window.api.addCurrencies(grandTotal,window.api.currency(this.state.shipping));
    this.setState({
      subtotal:subTotal,
      taxValue:taxValue,
      grandTotal:grandTotal
    });
  }

  completeSale = ()=>{
    if(this.state.cartItems.length < 1){
      this.setState({
        extrasError:true,
        extrasErrorMsg:'Cart is empty!'
      })
      setTimeout(()=>{
        this.setState({
          extrasError:false,
          extrasErrorMsg:''
        })
      },3000)
      return;
    }
    if(this.state.saleStatus < 1){
      this.setState({
        extrasError:true,
        extrasErrorMsg:'Select a delivery status!'
      })
      setTimeout(()=>{
        this.setState({
          extrasError:false,
          extrasErrorMsg:''
        })
      },3000)
      return;
    }
    if(this.state.paymentStatus < 1){
      this.setState({
        extrasError:true,
        extrasErrorMsg:'Select a payment status!'
      })
      setTimeout(()=>{
        this.setState({
          extrasError:false,
          extrasErrorMsg:''
        })
      },3000)
      return;
    }

    this.setState({showPrintModal:true});
  }

  proceedToPrintInvoice=()=>{
    let invoiceFields = {
      customerID:this.state.selectedCustomer,
      numberOfItems:this.state.cartItems.length,
      subTotal:window.api.currencyValue(this.state.subtotal),
      grandTotal:window.api.currencyValue(this.state.grandTotal),
      discount:window.api.currencyValue(this.state.discount),
      shipping:window.api.currencyValue(this.state.shipping),
      taxPercent:window.api.currencyValue(this.state.tax),
      taxValue:window.api.currencyValue(this.state.taxValue),
      deliveryStatus:this.state.saleStatus===1 ? 'delivered' : 'ordered',
      paymentStatus:this.state.paymentStatus,
      date:new Date().getTime()
    }
    let new_invoice_feedback = window.api.insertNewData('new-invoice', invoiceFields);
    this.setState({invoiceUID:new_invoice_feedback.ID});

    let soldItems = {
      items:this.state.cartItems,
      invoiceID:new_invoice_feedback.ID
    }
    let sales_feedback = window.api.insertNewData('new-sales', soldItems);
    if(sales_feedback.success){
      this.setState({
        cartItems:[],
        saleStatus:1,
        paymentStatus:1,
        extrasSuccess:true,
        extrasSuccessMsg:'Sale Complete',
        showPrintModal:false,
        printSize:'a4'
      },()=>this.calculateTotals())
      setTimeout(()=>{
        this.setState({
          extrasSuccess:false,
          extrasSuccessMsg:''
        })
      },3000)
    }    
  }

  resetCart = ()=>{
    this.setState({
      cartItems:[],
      saleStatus:1,
      paymentStatus:1,
      extrasError:true,
      extrasErrorMsg:'Cart Cleared'
    },()=>this.calculateTotals())
    setTimeout(()=>{
      this.setState({
        extrasError:false,
        extrasErrorMsg:''
      })
    },3000)
  }

  render() {
    return (
      <SalesPage visible={this.props.visibility}>
          <PageTitle>
            <h1>Sales</h1>
          </PageTitle>

          <div className='salesSection'>
            <div className='itemsSection'>
              <div className='searchItemDiv'>
                <Form.Group controlId="searchItems">
                  <Form.Control type="text" placeholder="Search Item..." 
                  value={this.state.searchItemValue} 
                  onChange={(e)=>this.setState({searchItemValue:e.target.value})} />
                </Form.Group>
              </div>

              <div className="itemsForSale">
                <Nav variant="tabs" defaultActiveKey="#" style={{backgroundColor:'#000'}}>
                  <Nav.Item>
                    <Nav.Link href="#" onClick={()=>this.setState({toggleItemsSales:true})}>Items</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="sales-table" onClick={()=>this.setState({toggleItemsSales:false})}>Recent Sales</Nav.Link>
                  </Nav.Item>
                </Nav>

                {this.state.toggleItemsSales ?
                <Table responsive striped bordered hover variant="light">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th style={{textAlign:'center'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.items.filter((s)=>(JSON.stringify(s).toLowerCase()
                      .includes(this.state.searchItemValue.toLowerCase())))
                      .map((item)=><tr key={item.item_id}>
                      <td>{item.item_id}</td>
                      <td>{item.item}</td>
                      <td>{item.description}</td>
                      <td>{item.available_qty}</td>
                      <td>{item.selling_unit_price}</td>
                      <td style={{textAlign:'center'}}>{this.itemInCart(item.item_id) ?
                        <Button variant='secondary' disabled>Item In Cart</Button> :
                        <Button variant='outline-success' onClick={()=>this.addItemTocart(item.item_id)}><FontAwesomeIcon icon={faCartShopping} /> Add To Cart</Button>
                      }</td>
                    </tr>)}
                  </tbody>
                </Table> :
                <RecentSalesTable sales={this.props.sales} />
                }
              </div>
            </div>

            <div className='cartSection'>
              <h5 style={{textAlign:'center'}}>INVOICE</h5>
              <div className='selectCustomerDiv'>
                <Form.Group controlId="selectCustomer">
                  <Form.Select aria-label="Select Item to purchase" onChange={this.handleSelectCustomer}>
                      <option value={0}>::SELECT CUSTOMER::</option>
                      {this.props.customers.length > 0 ? this.props.customers.map((customer)=>(<option key={customer.customer_id} value={customer.customer_id}>{customer.customer_name}</option>)) : <option>You have no customers added yet</option>}
                  </Form.Select>
                </Form.Group>
                <div className="cartItems">
                  <h5>Cart Items</h5>
                  <Table responsive striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Unit Price</th>
                            <th style={{textAlign:'center'}}>Qty</th>
                            <th>Sub Total</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.cartItems.map((item)=>{
                            return <tr key={item.item_id}>
                                <td>{item.item_id}</td>
                                <td>{item.item}</td>
                                <td>{item.selling_unit_price}</td>
                                <td className='p_qty'>
                                  <Button variant='warning' onClick={()=>{this.decreaseQty(item.item_id)}}><FontAwesomeIcon icon={faMinus} /></Button>
                                  <Form.Control type="text" 
                                  value={item.qty} onChange={(e)=>this.cartItemQtyChanged(e,item.item_id)} />
                                  <Button variant='success' onClick={()=>{this.increaseQty(item.item_id)}}><FontAwesomeIcon icon={faPlus} /></Button>
                                </td>
                                <td className='currency'>{item.selling_unit_price * item.qty}</td>
                                <td className="table-action-btns">
                                  <Button variant="danger" onClick={()=>{this.removeFromCart(item.item_id)}}><FontAwesomeIcon icon={faTrash} /></Button>
                                </td>                        
                            </tr>
                        })}
                    </tbody>
                  </Table>

                  <div className='cartSummary'>
                    <div></div>
                    <Table responsive striped bordered hover variant="dark">
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td>{window.api.currency(this.state.subtotal)}</td>
                          </tr>
                          <tr>
                            <td>Tax</td>
                            <td>{window.api.currency(this.state.taxValue)} ({this.state.tax}%)</td>
                          </tr>
                          <tr>
                            <td>Discount</td>
                            <td>{window.api.currency(this.state.discount)}</td>
                          </tr>
                          <tr>
                            <td>Shipping</td>
                            <td>{window.api.currency(this.state.shipping)}</td>
                          </tr>
                          <tr>
                            <th>Grand Total</th>
                            <th>{window.api.currency(this.state.grandTotal)}</th>
                          </tr>
                        </tbody>
                    </Table>
                  </div>
                      
                  {this.state.extrasError && <Alert variant='danger'>{this.state.extrasErrorMsg}</Alert>}
                  {this.state.extrasSuccess && <Alert variant='success'>{this.state.extrasSuccessMsg}</Alert>}
                  <CartExtras handleDiscount={this.handleDiscountField} handleTax={this.handleTaxField}
                      handleShipping={this.handleShippingField}
                      handleNote={this.handleNoteField}
                      paymentStatuses={this.props.payment_statuses}
                      resetCart={this.resetCart}
                      handleDelivery={this.handleDeliveryStatusField}
                      handlePayment={this.handlePaymentStatusField}
                      handleCheckout={this.completeSale} />
                  
                </div>
              </div>
            </div>
          </div>
          <Modal
            size="lg"
            show={this.state.showPrintModal}
            onHide={() => this.setState({showPrintModal:false,printSize:'a4'})}
            aria-labelledby="printModalTitle"
          >
            <Modal.Header closeButton>
              <Modal.Title id="printModalTitle">
                <FontAwesomeIcon icon={faPrint} /> Print Invoice
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs
                defaultActiveKey="a4"
                transition={false}
                id="noanim-tab-example"
                className="mb-3"
                onSelect={(e)=>this.setState({printSize:e})}
              >
                <Tab eventKey="a4" title="A4 Printer">
                <ReactToPrint
                    trigger={()=><Button variant='primary'><FontAwesomeIcon icon={faPrint} /> Print Invoice</Button>}
                    content={()=>this.componentRef}
                    documentTitle='Invoice'
                    pageStyle='print'
                />
                  <A4PrintingTemplate cartItems={this.state.cartItems} getCustomer={this.getCurrentCustomer}
                    invoiceDate={new Date().toLocaleDateString()} discount={this.state.discount}
                    shipping={this.state.shipping} tax={this.state.tax} taxValue={this.state.taxValue}
                    saleStatus={this.state.saleStatus} paymentStatus={this.state.paymentStatus}
                    invoiceUniqueID={this.state.invoiceUID} subtotal={this.state.subtotal}
                    grandtotal={this.state.grandTotal} ref={el => (this.componentRef = el)} />
                </Tab>
                <Tab eventKey="thermal" title="Thermal Printer">
                <ReactToPrint
                    trigger={()=><Button variant='primary'><FontAwesomeIcon icon={faPrint} /> Print Invoice</Button>}
                    content={()=>this.componentRef1}
                    documentTitle='Invoice'
                    pageStyle='print'
                />
                  <ThermalPrintingTemplate cartItems={this.state.cartItems} getCustomer={this.getCurrentCustomer}
                    invoiceDate={new Date().toLocaleDateString()} discount={this.state.discount}
                    shipping={this.state.shipping} tax={this.state.tax} taxValue={this.state.taxValue}
                    saleStatus={this.state.saleStatus} paymentStatus={this.state.paymentStatus}
                    invoiceUniqueID={this.state.invoiceUID} subtotal={this.state.subtotal}
                    grandtotal={this.state.grandTotal} ref={el => (this.componentRef1 = el)} />
                </Tab>
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='success' onClick={this.proceedToPrintInvoice}><FontAwesomeIcon icon={faPrint} /> Complete Sale</Button>
              <Button variant='warning' onClick={() => this.setState({showPrintModal:false,printSize:'a4'})}>Close</Button>
            </Modal.Footer>
          </Modal>

      </SalesPage>
    )
  }
}

export default Sales;
