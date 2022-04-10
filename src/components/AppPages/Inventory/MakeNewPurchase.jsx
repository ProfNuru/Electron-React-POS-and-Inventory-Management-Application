import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faMoneyCheck } from '@fortawesome/free-solid-svg-icons';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const MakeNewPurchase = ({all_items,getItem,suppliers,togglePageNotification,reloadData}) => {
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedSupplierID, setSelectedSupplierID] = useState(0);
    const [purchaseItemUnitCost, setPurchaseItemUnitCost] = useState(0.00);
    const [purchaseQty, setPurchaseQty] = useState(0);
    const [purchaseItemFormError, setPurchaseItemFormError] = useState(false);
    const [purchaseItemFormErrorMessage, setPurchaseItemFormErrorMessage] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSelectItem = (e)=>{
        let itemID = parseInt(e.target.value);  
        let s_item = getItem(itemID)
        if(s_item){
            setSelectedItem(s_item);
            setPurchaseItemUnitCost(s_item.cost_unit_price ? s_item.cost_unit_price : 0.0);
        }else{
            setSelectedItem({});
            setPurchaseItemUnitCost(0.0)
        }
    }

    const handleSelectSupplier = (e)=>{
        let supplier_id = parseInt(e.target.value);
        if(supplier_id > 0){
            setSelectedSupplierID(supplier_id);
        }else{
            setSelectedSupplierID(0);
        }
    }

    const completePurchase = (e)=>{
        if(selectedSupplierID < 1){
            setPurchaseItemFormError(true);
            setPurchaseItemFormErrorMessage('Supplier not selected!');
            setTimeout(()=>{
                setPurchaseItemFormError(false);
                setPurchaseItemFormErrorMessage('');
            },3000);
            return;
        }
        if(!selectedItem.item_id){
            setPurchaseItemFormError(true);
            setPurchaseItemFormErrorMessage('Item not selected!');
            setTimeout(()=>{
                setPurchaseItemFormError(false);
                setPurchaseItemFormErrorMessage('');
            },3000);
            return;
        }
        if(purchaseItemUnitCost <= 0){
            setPurchaseItemFormError(true);
            setPurchaseItemFormErrorMessage('Invalid entry for Unit Cost of Item!');
            setTimeout(()=>{
                setPurchaseItemFormError(false);
                setPurchaseItemFormErrorMessage('');
            },3000);
            return;
        }
        if(purchaseQty < 1){
            setPurchaseItemFormError(true);
            setPurchaseItemFormErrorMessage('Quantity must greater 0');
            setTimeout(()=>{
                setPurchaseItemFormError(false);
                setPurchaseItemFormErrorMessage('');
            },3000);
            return;
        }
        
        let purchaseValues = {
            unit_cost:parseFloat(purchaseItemUnitCost),
            supplier:selectedSupplierID,
            qty:purchaseQty + selectedItem.available_qty,
            item:selectedItem,
            date_purchased:new Date().getTime()
        };
        const feedback = window.api.insertNewData('new-purchase',purchaseValues);
        togglePageNotification(feedback);
        if(feedback.success){
            const item_update_feedback = window.api.insertNewData('post-purchase',{itemID:purchaseValues.item.item_id,qty:purchaseValues.qty,new_cost:purchaseValues.unit_cost});
            console.log(item_update_feedback);
        }
        reloadData();
        handleClose();
    }
    
    return (
        <>
            <Button className="inv-action-btn" variant="warning" onClick={handleShow}>
                <FontAwesomeIcon icon={faMoneyCheck}></FontAwesomeIcon> Purchase Item
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><FontAwesomeIcon icon={faMoneyCheck}></FontAwesomeIcon> Purchase New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {purchaseItemFormError && <Alert variant='danger'>{purchaseItemFormErrorMessage}</Alert>}
                
                <Form>
                    <Form.Group className="mb-3" controlId="supplier-field">
                        <Form.Label>Supplier</Form.Label>
                        <Form.Select aria-label="Select Item to purchase" onChange={handleSelectSupplier}>
                            <option value={0}>::SELECT SUPPLIER::</option>
                            {suppliers.length > 0 ? suppliers.map((supplier)=>(<option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>)) : <option>You have no suppliers added yet</option>}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="item-name-field">
                        <Form.Label>Item</Form.Label>
                        <Form.Select aria-label="Select Item to purchase" onChange={handleSelectItem}>
                            <option value={0}>::SELECT ITEM::</option>
                            {all_items.length > 0 ? all_items.map((item)=>(<option key={item.item_id} value={item.item_id}>{item.item}</option>)) : <option>No items added yet</option>}
                        </Form.Select>
                    </Form.Group>
                    

                    <Form.Group className="mb-3" controlId="item-desc-field">
                        <Form.Label>Unit Cost of Item</Form.Label>
                        <Form.Control type="text" value={purchaseItemUnitCost}
                            onChange={(e)=>setPurchaseItemUnitCost(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="item-desc-field">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" value={purchaseQty}
                            onChange={(e)=>setPurchaseQty(parseInt(e.target.value))} />
                    </Form.Group>
                    
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={completePurchase}>
                        Purchase
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MakeNewPurchase