import React, { Component } from 'react';
import {InventoryStyle} from './InventoryComponent.style';
import { PageTitle } from '../../AppContainer/PageTitle.style';
import InvCards from './InvCards';
import AddNewItem from './AddNewItem';
import MakeNewPurchase from './MakeNewPurchase';
import OutOfStockItems from './OutOfStockItems';
import InStockItems from './InStockItems';
import PurchasesList from './PurchasesList';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export class InventoryComponent extends Component {
  constructor(){
    super();

    this.state = {
      items:[],
      showEditItemForm:false,
      showViewItemForm:false,
      editItemFormSuccess:false,
      editItemFormError:false,
      inventoryPageSuccess:false,
      inventoryPageError:false,
      inventoryPageSuccessMessage:'',
      inventoryPageErrorMessage:'',
      editItemFormSuccessMessage:'',    
      editItemFormErrorMessage:'',
      selectedItem:{},
      selectedItemID:0,
      selectedItemForDelete:0,
      showDeleteItemPrompt:false
    }
  }

  hideEditItem = ()=>this.setState({showEditItemForm:false});
  showEditItem = ()=>this.setState({showEditItemForm:true});
  hideViewItem = ()=>this.setState({showViewItemForm:false});
  showViewItem = ()=>this.setState({showViewItemForm:true});
  hideDeletePrompt = ()=>this.setState({showDeleteItemPrompt:false});
  showDeletePrompt = ()=>this.setState({showDeleteItemPrompt:true});

  editItem = (id)=>{
    this.setState({
      selectedItem:this.getItem(id)
    })
    this.showEditItem();
  }

  submitEdititem = () => {
    const feedback = window.api.insertNewData('edit-item',this.state.selectedItem);
    if(feedback.success){
        this.setState({editItemFormSuccess:true})
        this.setState({editItemFormSuccessMessage:feedback.msg})
        setTimeout(()=>{
            this.setState({editItemFormSuccess:false})
            this.setState({editItemFormSuccessMessage:''})
        },3000);
    }else{
        this.setState({editItemFormError:true})
        this.setState({editItemFormErrorMessage:feedback.msg})
        setTimeout(()=>{
            this.setState({editItemFormError:false})
            this.setState({editItemFormErrorMessage:''})
        },3000);
        return;
    }
    this.getStatesData();
    this.hideEditItem();
  }

  inventoryPageNotification = (feedback) => {
    if(feedback.success){
        this.setState({inventoryPageSuccess:true})
        this.setState({inventoryPageSuccessMessage:feedback.msg})
        setTimeout(()=>{
            this.setState({inventoryPageSuccess:false})
            this.setState({inventoryPageSuccessMessage:''})
        },3000);
    }else{
        this.setState({inventoryPageError:true})
        this.setState({inventoryPageErrorMessage:feedback.msg})
        setTimeout(()=>{
            this.setState({inventoryPageError:false})
            this.setState({inventoryPageErrorMessage:''})
        },3000);
        return;
    }
  }

  getSupplier = (id)=>{
    for(var i=0; i<this.props.suppliers.length; i++){
      if(this.props.suppliers[i].supplier_id === id){
        return this.props.suppliers[i];
      }
    }
  }

  
  getItem = (id)=>{
    for(var i=0; i<this.state.items.length; i++){
      if(this.state.items[i].item_id === id){
        return this.state.items[i];
      }
    }
  }

  viewItem = (item_id) => {
    let item = this.getItem(item_id);
    this.setState({
        selectedItem:item
    });
    this.showViewItem()
  }

  deleteItem = (item_id) => {
    this.setState({
        selectedItemForDelete:item_id
    })
    this.showDeletePrompt();
  }

  
  proceedToDelete = ()=>{
    const feedback = window.api.updateDelete('delete-item',this.state.selectedItemForDelete);
    if(feedback.success){
        this.setState({inventoryPageSuccess:feedback.success});
        this.setState({inventoryPageSuccessMessage:feedback.msg});
        setTimeout(()=>{
            this.setState({inventoryPageSuccess:false})
            this.setState({inventoryPageSuccessMessage:''})
        },3000);
    }else{
        this.setState({inventoryPageError:!feedback.success});
        this.setState({inventoryPageErrorMessage:feedback.msg});
        setTimeout(()=>{
            this.setState({inventoryPageError:false})
            this.setState({inventoryPageErrorMessage:''})
        }, 3000);
    }

    this.hideDeletePrompt();
    this.getStatesData();
}
  
  getStatesData = ()=>{
    const items = window.api.sendAsynchronousIPC('get-all-items');
    this.setState({
      items:items.data,
    });
    this.props.reloadData();
  }

  componentDidMount() {
    this.getStatesData();
  }

  render() {
    return (
      <InventoryStyle visible={this.props.visibility}>
        <div className="inventory-main">
            <PageTitle>
                <h1>Inventory</h1>
            </PageTitle>
            <InvCards />
            {this.state.editItemFormSuccess && <PageTitle className="pageNotifications"><Alert variant='success'>{this.state.editItemFormSuccessMessage}</Alert></PageTitle>}
            {this.state.inventoryPageSuccess && <PageTitle className="pageNotifications"><Alert variant='success'>{this.state.inventoryPageSuccessMessage}</Alert></PageTitle>}
            {this.state.inventoryPageError && <PageTitle className="pageNotifications"><Alert variant='danger'>{this.state.inventoryPageErrorMessage}</Alert></PageTitle>}
            {this.state.items.filter((item)=>item.available_qty < 1).length > 0 && <OutOfStockItems toggleViewModal={this.viewItem} toggleEditModal={this.editItem} items={this.state.items.filter((item)=>item.available_qty < 1)} />}
            {this.state.items.filter((item)=>item.available_qty > 0).length > 0 && <InStockItems deleteItem={this.deleteItem} toggleViewModal={this.viewItem} toggleEditModal={this.editItem} items={this.state.items.filter((item)=>item.available_qty > 0)} />}
        </div>
        <div className="inventory-side">
            <AddNewItem reloadData={this.getStatesData} />
            <MakeNewPurchase reloadData={this.getStatesData} togglePageNotification={this.inventoryPageNotification} suppliers={this.props.suppliers} getItem={this.getItem} all_items={this.state.items} />
            <PurchasesList getSupplier={this.getSupplier} getItem={this.getItem} purchases={this.props.purchases} />
        </div>


        {/* Edit Item Modal */}
        <Modal show={this.state.showEditItemForm} onHide={this.hideEditItem}>
            <Modal.Header closeButton>
                <Modal.Title><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.state.editItemFormError && <Alert variant='danger'>{this.state.editItemFormErrorMessage}</Alert>}
                <Form>
                    <Form.Group className="mb-3" controlId="item-name">
                        <Form.Label>Item</Form.Label>
                        <Form.Control type="text" value={this.state.selectedItem.item ? this.state.selectedItem.item: ''}
                            onChange={(e)=>this.setState({selectedItem:{...this.state.selectedItem,item:e.target.value}})} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="item-description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={this.state.selectedItem.description ? this.state.selectedItem.description : ''}
                            onChange={(e)=>this.setState({selectedItem:{...this.state.selectedItem,description:e.target.value}})} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="cost-unit-price">
                        <Form.Label>Purchase Unit Price</Form.Label>
                        <Form.Control type="text" value={this.state.selectedItem.cost_unit_price ? this.state.selectedItem.cost_unit_price : ''}
                            onChange={(e)=>this.setState({selectedItem:{...this.state.selectedItem,cost_unit_price:e.target.value}})} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="selling-unit-price">
                        <Form.Label>Unit Price</Form.Label>
                        <Form.Control type="text" value={this.state.selectedItem.selling_unit_price ? this.state.selectedItem.selling_unit_price : ''}
                            onChange={(e)=>this.setState({selectedItem:{...this.state.selectedItem,selling_unit_price:e.target.value}})} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="supplier-city">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="text" value={this.state.selectedItem.available_qty ? this.state.selectedItem.available_qty : ''}
                            onChange={(e)=>this.setState({selectedItem:{...this.state.selectedItem,available_qty:e.target.value}})} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.hideEditItem}>
                    Close
                </Button>
                <Button variant="primary" onClick={this.submitEdititem}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>

        {/* View Item Modal */}
        <Modal show={this.state.showViewItemForm} onHide={this.hideViewItem}>
            <Modal.Header closeButton>
                <Modal.Title><FontAwesomeIcon icon={faEye} /> Item ID: {this.state.selectedItem.item_id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive striped variant="light">
                    <tbody>
                        <tr>
                            <td>Item</td>
                            <td>{this.state.selectedItem.item ? this.state.selectedItem.item : ''}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>{this.state.selectedItem.description ? this.state.selectedItem.description : ''}</td>
                        </tr>
                        <tr>
                            <td>Unit Purchase Price</td>
                            <td>{this.state.selectedItem.cost_unit_price ? this.state.selectedItem.cost_unit_price : ''}</td>
                        </tr>
                        <tr>
                            <td>Unit Price</td>
                            <td>{this.state.selectedItem.selling_unit_price ? this.state.selectedItem.selling_unit_price : ''}</td>
                        </tr>
                        <tr>
                            <td>Available Quantity</td>
                            <td>{this.state.selectedItem.available_qty ? this.state.selectedItem.available_qty : ''}</td>
                        </tr>
                        <tr>
                            <td>Date Added</td>
                            <td>{new Date(this.state.selectedItem.date_added).toLocaleDateString()}</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="info" onClick={this.hideViewItem}>Close</Button>
            </Modal.Footer>
        </Modal>

        {/* Delete Item Prompt */}
        <Modal show={this.state.showDeleteItemPrompt} onHide={this.hideDeletePrompt}>
            <Modal.Body>
                <h1 style={{textAlign:'center'}}>Are you sure?</h1>
                <h6 style={{textAlign:'center'}}>You won't be able to revert this!</h6>
                <div style={{textAlign:'center',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'}}>
                    <Button variant="outline-warning" size="lg" onClick={this.proceedToDelete}>Yes, Delete</Button>
                    <Button variant="danger" size="lg" onClick={this.hideDeletePrompt}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal>
      </InventoryStyle>
    )
  }
}

export default InventoryComponent;
