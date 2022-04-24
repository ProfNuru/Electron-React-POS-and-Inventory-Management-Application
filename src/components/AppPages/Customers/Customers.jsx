import React, { Component } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { CustomersPage } from './Customers.style';
import {PageTitle} from '../../AppContainer/PageTitle.style';
import {CustomersList} from './CustomersList.style';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';

import {faEdit, faEye, faPlus, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons';
import Debtors from './Debtors';

export class Customers extends Component {
    constructor(){
        super();
        this.state = {
            customerPageSuccess:false,
            customerPageError:false,
            customerPageSuccessMessage:'',
            customerPageErrorMessage:'',
            customersFilter:'',
            customers:[],
            customerSelectedForAction:0,
            customerSelected:{},
            viewCustomer:false,
            showNewCustomerForm:false,
            showCustomerDeletePrompt:false,
            showEditCustomerForm:false,
            customerFormSuccess:false,
            customerFormSuccessMessage:'',
            customerFormError:false,
            customerFormErrorMessage:'',
            customerFormFields:{
                customer_name:'',
                email:'',
                phone:'',
                country:'',
                city:'',
                address:''
            }
        }
    }

    showCustomerForm = ()=>this.setState({showNewCustomerForm:true})
    hideCustomerForm = ()=>this.setState({showNewCustomerForm:false})
    showDeletePrompt = ()=>this.setState({showCustomerDeletePrompt:true})
    hideDeletePrompt = ()=>this.setState({showCustomerDeletePrompt:false})
    showViewCustomerModal = ()=>this.setState({viewCustomer:true})
    hideViewCustomerModal = ()=>this.setState({viewCustomer:false})
    
    showEditCustomer = (customer_id)=>{
        this.setState({
            customerSelected:this.selectCustomer(customer_id),
            customerSelectedForAction:customer_id
        });
        this.setState({showEditCustomerForm:true})
    }
    hideEditCustomer = ()=>this.setState({showEditCustomerForm:false})

    addNewCustomer = ()=>{
        const timestamp = new Date().getTime();
        const newCustomer = {
            customer_name:this.state.customerFormFields.customer_name,
            email:this.state.customerFormFields.email,
            phone:this.state.customerFormFields.phone,
            country:this.state.customerFormFields.country,
            city:this.state.customerFormFields.city,
            address:this.state.customerFormFields.address,
            date_added:timestamp,
        }
        const feedback = window.api.insertNewData('new-customer',newCustomer);
        if(feedback.success){
            this.setState({customerFormSuccess:true})
            this.setState({customerFormSuccessMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerFormSuccess:false})
                this.setState({customerFormSuccessMessage:''})
            },3000);
            
            this.setState({customerFormFields:{
                customer_name:'',
                email:'',
                phone:'',
                country:'',
                city:'',
                address:''
            }})
        }else{
            this.setState({customerFormError:true})
            this.setState({customerFormErrorMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerFormError:false})
                this.setState({customerFormErrorMessage:''})
            },3000);
            return;
        }

        this.getStatesData();
    }

    pageNotification = (feedback)=>{
        if(feedback.success){
            this.setState({customerPageSuccess:true})
            this.setState({customerPageSuccessMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerPageSuccess:false})
                this.setState({customerPageSuccessMessage:''})
            },3000);
        }else{
            this.setState({customerPageError:true})
            this.setState({customerPageErrorMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerPageError:false})
                this.setState({customerPageErrorMessage:''})
            },3000);
            return;
        }
        this.getStatesData();
    }

    editCustomer = ()=>{
        const feedback = window.api.insertNewData('edit-customer',this.state.customerSelected);
        if(feedback.success){
            this.setState({customerPageSuccess:true})
            this.setState({customerPageSuccessMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerPageSuccess:false})
                this.setState({customerPageSuccessMessage:''})
            },3000);
        }else{
            this.setState({customerPageError:true})
            this.setState({customerPageErrorMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({customerPageError:false})
                this.setState({customerPageErrorMessage:''})
            },3000);
            return;
        }
        this.getStatesData();
        this.hideEditCustomer();
    }

    selectCustomer = (id)=>{
        for(var i=0; i<this.state.customers.length;i++){
            if(this.state.customers[i].customer_id === id){
                return this.state.customers[i];
            }
        }
        return false;
    }

    deleteCustomer = (customer_id) => {
        this.setState({
            customerSelectedForAction:customer_id
        })
        this.showDeletePrompt();
    }

    proceedToDelete = ()=>{
        const feedback = window.api.updateDelete('delete-customer',this.state.customerSelectedForAction);
        if(feedback.success){
            this.setState({customerPageSuccess:feedback.success});
            this.setState({customerPageSuccessMessage:feedback.msg});
            setTimeout(()=>{
                this.setState({customerPageSuccess:false})
                this.setState({customerPageSuccessMessage:''})
            },3000);
        }else{
            this.setState({customerPageError:!feedback.success});
            this.setState({customerPageErrorMessage:feedback.msg});
            setTimeout(()=>{
                this.setState({customerPageError:false})
                this.setState({customerPageErrorMessage:''})
            }, 3000);
        }

        this.hideDeletePrompt();
        this.getStatesData();
    }

    viewCustomer = (customer_id) => {
        let customer = this.selectCustomer(customer_id);
        this.setState({
            customerSelected:customer
        });
        this.showViewCustomerModal()
    }

    getStatesData = ()=>{
        const customers = window.api.sendAsynchronousIPC('get-all-customers');
        this.setState({
            customers:customers.data,
        });

        this.props.reloadData();
    }

    componentDidMount(){
        this.getStatesData();
    }

  render() {
    return (
      <CustomersPage visible={this.props.visibility}>
          <PageTitle>
              <h1>Customers</h1>
          </PageTitle>
          {this.state.customerPageSuccess && <PageTitle className="pageNotifications"><Alert variant='success'><h3>{this.state.customerPageSuccessMessage}</h3></Alert></PageTitle>}
          {this.state.customerPageError && <PageTitle className="pageNotifications"><Alert variant='danger'><h3>{this.state.customerPageErrorMessage}</h3></Alert></PageTitle>}
          <CustomersList>
              <div className="actions-row">
                  <div>
                    <FontAwesomeIcon icon={faSearch} />
                    <Form.Control type="text" placeholder="Search" 
                    value={this.state.customersFilter} 
                    onChange={(e)=>this.setState({customersFilter:e.target.value})} />
                  </div>
                  <div className="actionButtons">
                      <Button variant="secondary" onClick={this.showCustomerForm}>New Customer</Button>
                      <Modal show={this.state.showNewCustomerForm} onHide={this.hideCustomerForm}>
                        <Modal.Header closeButton>
                            <Modal.Title><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add New Customer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.customerFormSuccess && <Alert variant='success'>{this.state.customerFormSuccessMessage}</Alert>}
                            {this.state.customerFormError && <Alert variant='danger'>{this.state.customerFormErrorMessage}</Alert>}
                            <Form>
                                <Form.Group className="mb-3" controlId="supplier-name">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.customer_name}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,customer_name:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="customer-email">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.email}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,email:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="customer-phone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.phone}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,phone:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="customer-country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.country}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,country:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="customer-city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.city}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,city:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="customer-address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" value={this.state.customerFormFields.address}
                                     onChange={(e)=>this.setState({customerFormFields:{...this.state.customerFormFields,address:e.target.value}})} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideCustomerForm}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.addNewCustomer}>
                                Submit
                            </Button>
                        </Modal.Footer>
                        </Modal>
                  </div>
              </div>
              <div className="customerList">
                <Table responsive striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>E-mail</th>
                            <th>Country</th>
                            <th>City</th>
                            <th className="table-action-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.filter((s)=>(JSON.stringify(s).toLowerCase()
                                                .includes(this.state.customersFilter.toLowerCase())))
                                                .map((customer)=>{
                            return <tr key={customer.customer_id}>
                                <td>{customer.customer_id}</td>
                                <td>{customer.customer_name}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.email}</td>
                                <td>{customer.country}</td>
                                <td>{customer.city}</td>
                                <td className="table-action-btns">
                                    <Button variant="secondary" onClick={()=>this.viewCustomer(customer.customer_id)}><FontAwesomeIcon icon={faEye} /></Button>
                                    <Button variant="primary" onClick={()=>this.showEditCustomer(customer.customer_id)}><FontAwesomeIcon icon={faEdit} /></Button>
                                    <Button variant="danger" onClick={()=>this.deleteCustomer(customer.customer_id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                </td>                        
                            </tr>
                        })}
                    </tbody>
                </Table>
                
                {/* Delete Supplier Modal */}
                <Modal show={this.state.showCustomerDeletePrompt} onHide={this.hideDeletePrompt}>
                    <Modal.Body>
                        <h1 style={{textAlign:'center'}}>Are you sure?</h1>
                        <h6 style={{textAlign:'center'}}>You won't be able to revert this!</h6>
                        <div style={{textAlign:'center',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'}}>
                            <Button variant="outline-warning" size="lg" onClick={this.proceedToDelete}>Yes, Delete</Button>
                            <Button variant="danger" size="lg" onClick={this.hideDeletePrompt}>Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* View Supplier Modal */}
                <Modal show={this.state.viewCustomer} onHide={this.hideViewCustomerModal}>
                    <Modal.Header closeButton>
                        <Modal.Title><FontAwesomeIcon icon={faEye} /> Customer ID: {this.state.customerSelected.customer_id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive striped variant="light">
                            <tbody>
                                <tr>
                                    <td>Customer Name</td>
                                    <td>{this.state.customerSelected.customer_name}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{this.state.customerSelected.phone}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{this.state.customerSelected.email}</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td>{this.state.customerSelected.country}</td>
                                </tr>
                                <tr>
                                    <td>City</td>
                                    <td>{this.state.customerSelected.city}</td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td>{this.state.customerSelected.address}</td>
                                </tr>
                                <tr>
                                    <td>Date Added</td>
                                    <td>{new Date(this.state.customerSelected.date_added).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.hideViewCustomerModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Supplier Modal */}
                <Modal show={this.state.showEditCustomerForm} onHide={this.hideEditCustomer}>
                    <Modal.Header closeButton>
                        <Modal.Title><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.customerFormSuccess && <Alert variant='success'>{this.state.customerFormSuccessMessage}</Alert>}
                        {this.state.customerFormError && <Alert variant='danger'>{this.state.customerFormErrorMessage}</Alert>}
                        <Form>
                            <Form.Group className="mb-3" controlId="customer-name">
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.customer_name}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,customer_name:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="customer-email">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.email}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,email:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="customer-phone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.phone}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,phone:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="customer-country">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.country}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,country:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="customer-city">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.city}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,city:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="customer-address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" value={this.state.customerSelected.address}
                                    onChange={(e)=>this.setState({customerSelected:{...this.state.customerSelected,address:e.target.value}})} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideEditCustomer}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.editCustomer}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

              </div>
          </CustomersList>
          <div>
              <Debtors pageNotification={this.pageNotification} invoices={this.props.invoices} customers={this.props.customers} />
          </div>
      </CustomersPage>
    )
  }
}

export default Customers;