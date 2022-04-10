import React, { Component } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { SuppliersPage } from './Suppliers.style';
import {PageTitle} from '../../AppContainer/PageTitle.style';
import {SuppliersList} from './SuppliersList.style';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';

import {faEdit, faEye, faPlus, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons';

export class Suppliers extends Component {
    constructor(){
        super();
        this.state = {
            supplierPageSuccess:false,
            supplierPageError:false,
            supplierPageSuccessMessage:'',
            supplierPageErrorMessage:'',
            suppliersFilter:'',
            suppliers:[],
            supplierSelectedForAction:0,
            supplierSelected:{},
            viewSupplier:false,
            showNewSupplierForm:false,
            showSupplierDeletePrompt:false,
            showEditSupplierForm:false,
            supplierFormSuccess:false,
            supplierFormSuccessMessage:'',
            supplierFormError:false,
            supplierFormErrorMessage:'',
            supplierFormFields:{
                supplier_name:'',
                email:'',
                phone:'',
                country:'',
                city:'',
                address:''
            }
        }
    }

    showSupplierForm = ()=>this.setState({showNewSupplierForm:true})
    hideSupplierForm = ()=>this.setState({showNewSupplierForm:false})
    showDeletePrompt = ()=>this.setState({showSupplierDeletePrompt:true})
    hideDeletePrompt = ()=>this.setState({showSupplierDeletePrompt:false})
    showViewSupplierModal = ()=>this.setState({viewSupplier:true})
    hideViewSupplierModal = ()=>this.setState({viewSupplier:false})
    
    showEditSupplier = (supplier_id)=>{
        this.setState({
            supplierSelected:this.selectSupplier(supplier_id),
            supplierSelectedForAction:supplier_id
        });
        this.setState({showEditSupplierForm:true})
    }
    hideEditSupplier = ()=>this.setState({showEditSupplierForm:false})

    addNewSupplier = ()=>{
        const timestamp = new Date().getTime();
        const newSupplier = {
            supplier_name:this.state.supplierFormFields.supplier_name,
            email:this.state.supplierFormFields.email,
            phone:this.state.supplierFormFields.phone,
            country:this.state.supplierFormFields.country,
            city:this.state.supplierFormFields.city,
            address:this.state.supplierFormFields.address,
            date_added:timestamp,
        }
        const feedback = window.api.insertNewData('new-supplier',newSupplier);
        if(feedback.success){
            this.setState({supplierFormSuccess:true})
            this.setState({supplierFormSuccessMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({supplierFormSuccess:false})
                this.setState({supplierFormSuccessMessage:''})
            },3000);
            
            this.setState({supplierFormFields:{
                supplier_name:'',
                email:'',
                phone:'',
                country:'',
                city:'',
                address:''
            }})
        }else{
            this.setState({supplierFormError:true})
            this.setState({supplierFormErrorMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({supplierFormError:false})
                this.setState({supplierFormErrorMessage:''})
            },3000);
            return;
        }

        this.getStatesData();
    }

    editSupplier = ()=>{
        const feedback = window.api.insertNewData('edit-supplier',this.state.supplierSelected);
        if(feedback.success){
            this.setState({supplierPageSuccess:true})
            this.setState({supplierPageSuccessMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({supplierPageSuccess:false})
                this.setState({supplierPageSuccessMessage:''})
            },3000);
        }else{
            this.setState({supplierPageError:true})
            this.setState({supplierPageErrorMessage:feedback.msg})
            setTimeout(()=>{
                this.setState({supplierPageError:false})
                this.setState({supplierPageErrorMessage:''})
            },3000);
            return;
        }
        this.getStatesData();
        this.hideEditSupplier();
    }

    selectSupplier = (id)=>{
        for(var i=0; i<this.state.suppliers.length;i++){
            if(this.state.suppliers[i].supplier_id === id){
                return this.state.suppliers[i];
            }
        }
        return false;
    }

    deleteSupplier = (supplier_id) => {
        this.setState({
            supplierSelectedForAction:supplier_id
        })
        this.showDeletePrompt();
    }

    proceedToDelete = ()=>{
        const feedback = window.api.updateDelete('delete-supplier',this.state.supplierSelectedForAction);
        if(feedback.success){
            this.setState({supplierPageSuccess:feedback.success});
            this.setState({supplierPageSuccessMessage:feedback.msg});
            setTimeout(()=>{
                this.setState({supplierPageSuccess:false})
                this.setState({supplierPageSuccessMessage:''})
            },3000);
        }else{
            this.setState({supplierPageError:!feedback.success});
            this.setState({supplierPageErrorMessage:feedback.msg});
            setTimeout(()=>{
                this.setState({supplierPageError:false})
                this.setState({supplierPageErrorMessage:''})
            }, 3000);
        }

        this.hideDeletePrompt();
        this.getStatesData();
    }

    viewSupplier = (supplier_id) => {
        let supplier = this.selectSupplier(supplier_id);
        this.setState({
            supplierSelected:supplier
        });
        this.showViewSupplierModal()
    }

    getStatesData = ()=>{
        const suppliers = window.api.sendAsynchronousIPC('get-all-suppliers');
        this.setState({
            suppliers:suppliers.data,
        });

        this.props.reloadData();
    }

    componentDidMount(){
        this.getStatesData();
    }

  render() {
    return (
      <SuppliersPage visible={this.props.visibility}>
          <PageTitle>
              <h1>Suppliers</h1>
          </PageTitle>
          {this.state.supplierPageSuccess && <PageTitle className="pageNotifications"><Alert variant='success'><h3>{this.state.supplierPageSuccessMessage}</h3></Alert></PageTitle>}
          {this.state.supplierPageError && <PageTitle className="pageNotifications"><Alert variant='danger'><h3>{this.state.supplierPageErrorMessage}</h3></Alert></PageTitle>}
          <SuppliersList>
              <div className="actions-row">
                  <div>
                    <FontAwesomeIcon icon={faSearch} />
                    <Form.Control type="text" placeholder="Search" 
                    value={this.state.suppliersFilter} 
                    onChange={(e)=>this.setState({suppliersFilter:e.target.value})} />
                  </div>
                  <div className="actionButtons">
                      <Button variant="secondary" onClick={this.showSupplierForm}>New Supplier</Button>
                      <Modal show={this.state.showNewSupplierForm} onHide={this.hideSupplierForm}>
                        <Modal.Header closeButton>
                            <Modal.Title><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add New Supplier</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.supplierFormSuccess && <Alert variant='success'>{this.state.supplierFormSuccessMessage}</Alert>}
                            {this.state.supplierFormError && <Alert variant='danger'>{this.state.supplierFormErrorMessage}</Alert>}
                            <Form>
                                <Form.Group className="mb-3" controlId="supplier-name">
                                    <Form.Label>Supplier Name</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.supplier_name}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,supplier_name:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="supplier-email">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.email}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,email:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="supplier-phone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.phone}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,phone:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="supplier-country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.country}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,country:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="supplier-city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.city}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,city:e.target.value}})} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="supplier-address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" value={this.state.supplierFormFields.address}
                                     onChange={(e)=>this.setState({supplierFormFields:{...this.state.supplierFormFields,address:e.target.value}})} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hideSupplierForm}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.addNewSupplier}>
                                Submit
                            </Button>
                        </Modal.Footer>
                        </Modal>
                  </div>
              </div>
              <div className="supplierList">
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
                        {this.state.suppliers.filter((s)=>(JSON.stringify(s).toLowerCase()
                                                .includes(this.state.suppliersFilter.toLowerCase())))
                                                .map((supplier)=>{
                            return <tr key={supplier.supplier_id}>
                                <td>{supplier.supplier_id}</td>
                                <td>{supplier.supplier_name}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.country}</td>
                                <td>{supplier.city}</td>
                                <td className="table-action-btns">
                                    <Button variant="secondary" onClick={()=>this.viewSupplier(supplier.supplier_id)}><FontAwesomeIcon icon={faEye} /></Button>
                                    <Button variant="primary" onClick={()=>this.showEditSupplier(supplier.supplier_id)}><FontAwesomeIcon icon={faEdit} /></Button>
                                    <Button variant="danger" onClick={()=>this.deleteSupplier(supplier.supplier_id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                </td>                        
                            </tr>
                        })}
                    </tbody>
                </Table>
                
                {/* Delete Supplier Modal */}
                <Modal show={this.state.showSupplierDeletePrompt} onHide={this.hideDeletePrompt}>
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
                <Modal show={this.state.viewSupplier} onHide={this.hideViewSupplierModal}>
                    <Modal.Header closeButton>
                        <Modal.Title><FontAwesomeIcon icon={faEye} /> Supplier ID: {this.state.supplierSelected.supplier_id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive striped variant="light">
                            <tbody>
                                <tr>
                                    <td>Supplier Name</td>
                                    <td>{this.state.supplierSelected.supplier_name}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{this.state.supplierSelected.phone}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{this.state.supplierSelected.email}</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td>{this.state.supplierSelected.country}</td>
                                </tr>
                                <tr>
                                    <td>City</td>
                                    <td>{this.state.supplierSelected.city}</td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td>{this.state.supplierSelected.address}</td>
                                </tr>
                                <tr>
                                    <td>Date Added</td>
                                    <td>{new Date(this.state.supplierSelected.date_added).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.hideViewSupplierModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Supplier Modal */}
                <Modal show={this.state.showEditSupplierForm} onHide={this.hideEditSupplier}>
                    <Modal.Header closeButton>
                        <Modal.Title><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add New Supplier</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.supplierFormSuccess && <Alert variant='success'>{this.state.supplierFormSuccessMessage}</Alert>}
                        {this.state.supplierFormError && <Alert variant='danger'>{this.state.supplierFormErrorMessage}</Alert>}
                        <Form>
                            <Form.Group className="mb-3" controlId="supplier-name">
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.supplier_name}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,supplier_name:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="supplier-email">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.email}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,email:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="supplier-phone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.phone}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,phone:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="supplier-country">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.country}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,country:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="supplier-city">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.city}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,city:e.target.value}})} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="supplier-address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" value={this.state.supplierSelected.address}
                                    onChange={(e)=>this.setState({supplierSelected:{...this.state.supplierSelected,address:e.target.value}})} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideEditSupplier}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.editSupplier}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

              </div>
          </SuppliersList>
      </SuppliersPage>
    )
  }
}

export default Suppliers