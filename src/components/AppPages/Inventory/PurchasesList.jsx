import React, {useState} from 'react';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const PurchasesList = ({purchases,getItem,getSupplier}) => {
  const [filterPurchasesField,setFilterPurchasesField] = useState('');

  return (
    <div className="purchases-section">
        <h4>All Purchases</h4>
        <Form.Group className="mb-3" controlId="searchPurchases">
            <Form.Control type="text" placeholder="Filter Purchases..." 
              value={filterPurchasesField}
              onChange={(e)=>setFilterPurchasesField(e.target.value)} />
        </Form.Group>
        
        <Table responsive striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Supplier</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
          {purchases.map((purchase)=>{
                return {...purchase,
                    item_id:getItem(purchase.item_id) ? getItem(purchase.item_id).item : '',
                    supplier_id:getSupplier(purchase.supplier_id) ? getSupplier(purchase.supplier_id).supplier_name : ''
                  }
              })
              .filter((purchase)=>(JSON.stringify(purchase).toLowerCase()
              .includes(filterPurchasesField.toLowerCase())))
              .map((purchase)=>(<tr key={purchase.purchase_id}>
              <td>{purchase.purchase_id}</td>
              <td>{purchase.item_id}</td>
              <td>{purchase.supplier_id}</td>
              <td>{purchase.qty}</td>
              <td>{purchase.unit_price}</td>
              <td>{purchase.qty * purchase.unit_price}</td>
            </tr>))}
          </tbody>
        </Table>
    </div>
  )
}

export default PurchasesList