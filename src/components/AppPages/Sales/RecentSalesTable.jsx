import React from 'react'
import Table from 'react-bootstrap/Table';

const RecentSalesTable = ({sales}) => {
  return (
    <Table responsive striped bordered hover variant="dark">
        <thead>
            <tr>
                <th>Ref</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Delivery Status</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Status</th>
            </tr>
        </thead>
    </Table>
  )
}

export default RecentSalesTable