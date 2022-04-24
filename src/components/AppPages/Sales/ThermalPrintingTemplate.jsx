import React,{Component} from 'react'
import { ThermalPrintTemplate } from './ThermalPrintingTemplate.style';

class ThermalPrintingTemplate extends Component {
    render(){
        const customer = this.props.getCustomer();
        return (
            <ThermalPrintTemplate id="thermal-print-invoice">
                <center id="top">
                  <div className="info"><br/>
                    <h1>INVOICE #{this.props.invoiceUniqueID}</h1>
                    <h2>GuildBytes Tech Solutions</h2>
                    <p>
                        Koyla Junction<br/>
                        guildbytes@gmail.com<br/>
                        555-555-5555<br/>
                    </p>
                  </div>
                </center>
                <p>Date: {this.props.invoiceDate}</p>
        
                <div id="mid">
                  <div className="info">
                    {customer && <p>
                        <strong>Customer</strong>: {customer.customer_name}<br/>
                        <strong>Address</strong> : {customer.address}<br/>
                        <strong>Phone</strong>   : {customer.phone}<br/>
                    </p>}
                  </div>
                </div>
        
                <div id="bot">
                    <div id="table">
                        <table>
                            <tbody>
                                <tr className="tabletitle">
                                    <td className="item"><h4>Item</h4></td>
                                    <td className="Hours"><h4>Qty</h4></td>
                                    <td className="Rate"><h4>Sub Total</h4></td>
                                </tr>

                                {this.props.cartItems.map((item)=>(<tr className="service" key={item.item_id}>
                                    <td className="tableitem"><p className="itemtext">{item.item}</p></td>
                                    <td className="tableitem"><p className="itemtext">{item.qty}</p></td>
                                    <td className="tableitem"><p className="itemtext">{window.api.currency(window.api.multiplyCurrencies(item.qty,item.selling_unit_price))}</p></td>
                                </tr>))}
            
                                <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Subtotal</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.subtotal)}</h2></td>
                                </tr>
            
                                {this.props.tax > 0 && <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Tax</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.taxValue)} ({this.props.tax} %)</h2></td>
                                </tr>}

                                {this.props.shipping > 0 && <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Shipping</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.shipping)}</h2></td>
                                </tr>}
            
                                {this.props.discount > 0 && <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Shipping</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.discount)}</h2></td>
                                </tr>}

                                <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Total</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.grandtotal)}</h2></td>
                                </tr>
                                <tr className="tabletitle">
                                    <td></td>
                                    <td className="Rate"><h2>Paid</h2></td>
                                    <td className="payment"><h2>{window.api.currency(this.props.payment)}</h2></td>
                                </tr>
                            </tbody>        
                        </table>
                    </div>
                    <div id="legalcopy">
                        <p className="legal"><strong>Thank you for your business!</strong>  
                            Payment is expected within 31 days; please process this invoice within that time. 
                            There will be a 5% interest charge per month on late invoices.
                        </p>
                    </div>
        
                </div>
            </ThermalPrintTemplate>
        )
    }
}

export default ThermalPrintingTemplate