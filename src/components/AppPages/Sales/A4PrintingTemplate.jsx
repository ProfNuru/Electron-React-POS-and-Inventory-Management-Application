import React, {Component} from 'react';
import { A4PrintTemplate } from './A4PrintingTemplate.style';

class A4PrintingTemplate extends Component {
    render(){
        const customer = this.props.getCustomer();
        return (
            <A4PrintTemplate>
                <div id="invoiceholder">
                    <h1>INVOICE #{this.props.invoiceUniqueID}</h1>
                    <p className='businessDetails'><strong>GuildBytes Tech Solutions</strong><br/>
                    Gurugu Road, Near Koyla junction, Tamale<br/>
                    guildbytes@gmail.com<br/>+23312345678 / +23379461289</p>
                    <div id='invoiceDetails'>
                        <div className='clientDetails'>
                            {customer && <h5>{customer.customer_name}<br/>
                            {customer.address}<br/>
                            {customer.phone}</h5>}
                        </div>
                        <div className='billDetails'>
                            <h5>Date: {this.props.invoiceDate}<br />
                            Amount Due: <span>{window.api.subtractCurrencies(this.props.grandtotal,this.props.payment)}</span></h5>
                        </div>
                    </div>
        
                    <div id='invoiceItemsTable'>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Description</th>
                                    <th><span>Unit Price</span></th>
                                    <th>Qty</th>
                                    <th><span>Amount</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.cartItems.map((item)=>(<tr key={item.item_id}>
                                    <td>{item.item_id}</td>
                                    <td>{item.item}</td>
                                    <td>{item.description}</td>
                                    <td className='itemCurrencyValues'>{window.api.currency(item.selling_unit_price)}</td>
                                    <td>{item.qty}</td>
                                    <td className='itemCurrencyValues'>{window.api.currency(window.api.multiplyCurrencies(item.qty,item.selling_unit_price))}</td>
                                </tr>))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5} className='invoiceFootTitles'>Sub Total</td>
                                    <td>{window.api.currency(this.props.subtotal)}</td>
                                </tr>
                                {this.props.tax > 0 && <tr>
                                    <td colSpan={5} className='invoiceFootTitles'>Tax</td>
                                    <td>{window.api.currency(this.props.taxValue)} ({this.props.tax} %)</td>
                                </tr>}
                                {this.props.shipping > 0 && <tr>
                                    <td colSpan={5} className='invoiceFootTitles'>Shipping</td>
                                    <td>{window.api.currency(this.props.shipping)}</td>
                                </tr>}
                                {this.props.discount > 0 && <tr>
                                    <td colSpan={5} className='invoiceFootTitles'>Discount</td>
                                    <td>{window.api.currency(this.props.discount)}</td>
                                </tr>}
                                <tr className='grandTotalEmphasis'>
                                    <td colSpan={5} className='invoiceFootTitles'>Grand Total</td>
                                    <td>{window.api.currency(this.props.grandtotal)}</td>
                                </tr>
                                <tr className='grandTotalEmphasis'>
                                    <td colSpan={5} className='invoiceFootTitles'>Paid</td>
                                    <td>{window.api.currency(this.props.payment)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
        
                    <div id='invoiceEndMatter'>
                        <p>Thank you for your business!<br/>
                            Payment is expected within 31 days; 
                            please process this invoice within that time. 
                            There will be a 5% interest charge per month on late invoices.</p>
                        <p>..........................<br/>
                        John Doe <br/>
                        Sales Person</p>
                    </div>
                </div>
            </A4PrintTemplate>
        )
    }
}

// const A4PrintingTemplate = ({cartItems,
//                             discount,
//                             shipping,
//                             tax,
//                             taxValue,
//                             saleStatus,
//                             paymentStatus,
//                             subtotal,
//                             grandtotal,
//                             invoiceUniqueID})
export default A4PrintingTemplate;
