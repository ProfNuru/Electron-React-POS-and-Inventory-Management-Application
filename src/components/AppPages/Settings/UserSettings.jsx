import React from 'react';
import { UserSettingsTab } from './UserSettings.style';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UserSettings = () => {
  return (
    <UserSettingsTab>
        <h1>User Profile</h1>
        <p>This user will be displayed as issuer of invoices</p>
        <Form className="namesForm">
            <Form.Group className="mb-3" controlId="formBasicFirstName">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" placeholder="Enter address" />
            </Form.Group>
        </Form>
        <div className="buttons">
            <Button variant='primary'>Save</Button>
        </div>
    </UserSettingsTab>
  )
}

export default UserSettings