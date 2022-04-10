import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const AddNewItem = ({reloadData}) => {
    const [show, setShow] = useState(false);
    const [item, setItem] = useState('');
    const [description, setDescription] = useState('');
    const [success,setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error,setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const addNewItem = ()=>{
        const timestamp = new Date().getTime();
        const newItem = {
            item:item,
            description:description,
            date_added:timestamp
        }
        const feedback = window.api.insertNewData('new-item',newItem);
        if(feedback.success){
            setSuccess(true);
            setSuccessMsg(feedback.msg)
            setTimeout(()=>{
                setSuccess(false);
                setSuccessMsg('');
            },3000);
            setItem('');
            setDescription('');
            reloadData();
            return;
        }
        if(feedback.msg === 'SQLITE_CONSTRAINT'){
            setError(true);
            setErrorMsg("An item already exists with the same name!")
            setTimeout(()=>{
                setError(false);
                setErrorMsg('');
            },3000);
            return;
        }
    }
    return (
        <>
            <Button className="inv-action-btn" variant="info" onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add New Item
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add New item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {success && <Alert variant='success'>{successMsg}</Alert>}
                {error && <Alert variant='danger'>{errorMsg}</Alert>}
                <Form>
                    <Form.Group className="mb-3" controlId="item-name-field">
                        <Form.Label>Item</Form.Label>
                        <Form.Control type="text" value={item} onChange={(e)=>setItem(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="item-desc-field">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={(e)=>setDescription(e.target.value)} />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addNewItem}>
                        Add Item
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddNewItem