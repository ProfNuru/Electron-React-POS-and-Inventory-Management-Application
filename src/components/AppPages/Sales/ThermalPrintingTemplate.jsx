import React,{Component} from 'react'
import { ThermalPrintTemplate } from './ThermalPrintingTemplate.style';

class ThermalPrintingTemplate extends Component {
    render(){
        return (
            <ThermalPrintTemplate id="thermal-print-invoice">
                <center id="top">
                  <div className="info"><br/>
                    <h1>INVOICE #0123</h1>
                    <h2>GuildBytes Tech Solutions</h2>
                    <p>
                        Koyla Junction<br/>
                        guildbytes@gmail.com<br/>
                        555-555-5555<br/>
                    </p>
                  </div>
                </center>
        
                <div id="mid">
                  <div className="info">
                    <p>
                        <strong>Customer</strong>: John Doe<br/>
                        <strong>Address</strong> : street city, state 0000<br/>
                        <strong>Phone</strong>   : 555-555-5555<br/>
                    </p>
                  </div>
                </div>
        
                <div id="bot">
                    <div id="table">
                        <table>
                            <tr className="tabletitle">
                                <td className="item"><h4>Item</h4></td>
                                <td className="Hours"><h4>Qty</h4></td>
                                <td className="Rate"><h4>Sub Total</h4></td>
                            </tr>
        
                            <tr className="service">
                                <td className="tableitem"><p className="itemtext">Communication</p></td>
                                <td className="tableitem"><p className="itemtext">5</p></td>
                                <td className="tableitem"><p className="itemtext">$375.00</p></td>
                            </tr>
        
                            <tr className="service">
                                <td className="tableitem"><p className="itemtext">Asset Gathering</p></td>
                                <td className="tableitem"><p className="itemtext">3</p></td>
                                <td className="tableitem"><p className="itemtext">$225.00</p></td>
                            </tr>
        
                            <tr className="service">
                                <td className="tableitem"><p className="itemtext">Design Development</p></td>
                                <td className="tableitem"><p className="itemtext">5</p></td>
                                <td className="tableitem"><p className="itemtext">$375.00</p></td>
                            </tr>
        
                            <tr className="service">
                                <td className="tableitem"><p className="itemtext">Animation</p></td>
                                <td className="tableitem"><p className="itemtext">20</p></td>
                                <td className="tableitem"><p className="itemtext">$1500.00</p></td>
                            </tr>
        
                            <tr className="service">
                                <td className="tableitem"><p className="itemtext">Animation Revisions</p></td>
                                <td className="tableitem"><p className="itemtext">10</p></td>
                                <td className="tableitem"><p className="itemtext">$750.00</p></td>
                            </tr>
        
        
                            <tr className="tabletitle">
                                <td></td>
                                <td className="Rate"><h2>tax</h2></td>
                                <td className="payment"><h2>$419.25</h2></td>
                            </tr>
        
                            <tr className="tabletitle">
                                <td></td>
                                <td className="Rate"><h2>Total</h2></td>
                                <td className="payment"><h2>$3,644.25</h2></td>
                            </tr>
        
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