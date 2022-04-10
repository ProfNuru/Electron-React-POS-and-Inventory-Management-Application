import React from 'react';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const InStockItems = ({items,toggleEditModal,toggleViewModal,deleteItem}) => {
  return (
    <div className="in-stock-items">
        <h3>In Stock</h3>
        <Table responsive striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Unit Purchase Price</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th style={{textAlign:'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item)=>(<tr key={item.item_id}>
              <td>{item.item_id}</td>
              <td>{item.item}</td>
              <td>{item.cost_unit_price}</td>
              <td>{item.selling_unit_price}</td>
              <td>{item.available_qty}</td>
              <td className="item-action-btns" style={{textAlign:'right'}}>
                <Button variant="secondary" style={{margin:'0px 2px'}} onClick={()=>toggleViewModal(item.item_id)}><FontAwesomeIcon icon={faEye} /></Button>
                <Button variant="success" style={{margin:'0px 2px'}} onClick={()=>toggleEditModal(item.item_id)}><FontAwesomeIcon icon={faEdit} /></Button>
                <Button variant="danger" style={{margin:'0px 2px'}} onClick={()=>deleteItem(item.item_id)}><FontAwesomeIcon icon={faTrash} /></Button>
              </td>
            </tr>))}
          </tbody>
        </Table>
    </div>
  )
}

export default InStockItems