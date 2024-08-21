import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import API_URL from '../../config';

export default function AdminPasswordReset() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handlePasswordReset = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
    
        if (password !== confirmPassword) {
            setAlert({ show: true, message: "Passwords do not match.", variant: "danger" });
            return;
        }
    
        setLoading(true);
    
        try {
            console.log('Sending password reset request with token:', token); // Log token being used
            const response = await fetch(`${API_URL}/admin/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
    
            console.log('Response status:', response.status); // Log the status code
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                setAlert({ show: true, message: errorData.message || 'Failed to reset password.', variant: 'danger' });
                return;
            }
    
            const result = await response.json();
            console.log('Server response:', result); // Log the successful response
    
            setAlert({ show: true, message: 'Password reset successfully.', variant: 'success' });
            navigate('/admin/login'); // Redirect to login page after successful reset
        } catch (error) {
            console.error('Error resetting password:', error);
            setAlert({ show: true, message: 'An error occurred. Please try again later.', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Form noValidate validated={validated} onSubmit={handlePasswordReset}>
            <h2>Reset Password</h2>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <Form.Group controlId="formPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Please enter a new password.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Please confirm your new password.
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="mt-3">
                {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </Form>
    );
}
