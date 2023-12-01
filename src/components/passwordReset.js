import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, updatePassword, sendPasswordResetEmail } from '../firebase';
import './passwordReset.css';

const PasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const handlePasswordReset = async () => {
        try {
            console.log('Before validation check');

            // Check if passwords match
            if (newPassword !== confirmNewPassword) {
                setValidationError(false);
                setError("Passwords entered do not match");
                setSuccess(false);
                clearFields();
                return;
            }

            // Check if password is less than 6 characters
            if (newPassword.length < 6) {
                setValidationError(false);
                setError("Password length must be more than 6 characters");
                setSuccess(false);
                clearFields();
                return;
            }

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                setValidationError(true);
                setError(null);
                console.log('Validation failed');
                return;
            }

            const user = auth.currentUser;

            console.log('Before reauthentication');

            try {
                // Reauthenticate the user with their current password
                await signInWithEmailAndPassword(auth, user.email, currentPassword);

                console.log('Before password update');
                // Update the user's password
                await updatePassword(auth.currentUser, newPassword);

                console.log('Password change successful');
                setSuccess(true);
                setError(null);
                setStatusMessage('');
                clearFields();
            } catch (reauthError) {
                // Handle incorrect current password
                console.error('Reauthentication error:', reauthError);
                setSuccess(false);
                setError("Incorrect password");
                setStatusMessage('');
                clearFields();
            }
        } catch (error) {
            // Handle other errors
            console.error('Password change error:', error);
            setSuccess(false);
            setError(error.message);
            setStatusMessage('');
            clearFields();
        }
    };

    const handleForgotPassword = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                setError("User not authenticated. Please log in or sign up.");
                return;
            }

            const userEmail = user.email;

            if (!userEmail) {
                setError("No email associated with the account. Please provide an email address.");
                return;
            }

            await sendPasswordResetEmail(auth, userEmail);
            setSuccess(true);
            setError(null);
            setStatusMessage(`Password reset link sent to ${userEmail}`);
            clearFields();
        } catch (error) {
            console.error('Forgot password error:', error);
            setSuccess(false);
            setError(error.message);
            setStatusMessage('');
            clearFields();
        }
    };

    const clearFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };


    return (
        <div className="container">
            <div className="password-reset-container">
                <h1 className='pass-reset-title'>Change Password</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{statusMessage}</p>}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label className="auth-label">Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`current inputBox ${validationError && !currentPassword ? 'error' : ''}`}
                        />
                    </div>
                    <div className="form-group">
                        <label className="auth-label forgot" onClick={handleForgotPassword}>Forgot Password?</label>
                    </div>
                    <div className="form-group">
                        <label className="auth-label">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`inputBox ${validationError && !newPassword ? 'error' : ''}`}
                        />
                    </div>
                    <div className="form-group">
                        <label className="auth-label">Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className={`inputBox ${validationError && !confirmNewPassword ? 'error' : ''}`}
                        />
                    </div>
                    <button className="login" onClick={handlePasswordReset}>
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
