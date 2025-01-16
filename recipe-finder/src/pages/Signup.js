import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Ensure you have the CSS styles for this component

const Signup = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error
        setError('');
        setLoading(true); // Start loading

        // Validate name and surname (no numbers allowed)
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(name) || !nameRegex.test(surname)) {
            setError('Name and surname cannot contain numbers');
            setLoading(false);
            return;
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least 8 characters, including a letter, number, and special character');
            setLoading(false);
            return;
        }

        // Send signup request to the backend
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname, email, password }),
            });

            const data = await response.json();
            setLoading(false); // Stop loading

            if (response.ok) {
                alert('User registered successfully!');
                navigate('/login'); // Redirect to login
            } else {
                setError(data.message); // Show error from backend
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create an Account</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
