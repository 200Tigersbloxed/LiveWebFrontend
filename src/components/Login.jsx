// Login styling provided by https://github.com/DaveSimoes/login-signup-react-bootstrap

import { useState } from 'react';
import user from '../scripts/user.js';
import { API_URL } from '../constants/api.js';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupToken, setSignupToken] = useState('');

    const [isRegister, setIsRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [requireToken, setRequireToken] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    async function login() {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await user.login(
                API_URL,
                username,
                password
            );

            if (!result) {
                setErrorMessage('Failed to login!');
                return;
            }
            onLogin?.();
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Failed to login!');
        } finally {
            setIsLoading(false);
        }
    }

    async function register() {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await user.createUser(
                API_URL,
                username,
                password,
                signupToken
            );
            if (!result) {
                setErrorMessage('Could not create account!');
                return;
            }
            onLogin?.();
        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage('Could not create account!');
        } finally {
            setIsLoading(false);
        }
    }

    async function swap() {
        setErrorMessage('');
        if (requireToken === undefined) {
            try {
                const result = await user.needsSignupToken(API_URL);
                setRequireToken(result);
            } catch (error) {
                console.error(
                    'Failed to check signup token requirement:',
                    error
                );
                setErrorMessage(
                    'Could not check registration requirements!'
                );
                return;
            }
        }
        setIsRegister(previous => !previous);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isRegister) {
            register();
        } else {
            login();
        }
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="row justify-content-center w-100">
                <div className="col-12 col-sm-11 col-md-9 col-lg-8 col-xl-7">
                    <div className="card shadow-lg rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2">
                                    {isRegister
                                        ? 'Create Account'
                                        : 'Welcome Back'}
                                </h2>
                                <p className="text-muted mb-0">
                                    {isRegister
                                        ? 'Register a new account to get started.'
                                        : 'Please sign in to continue.'}
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="username"
                                        className="form-label fw-semibold"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={e =>
                                            setUsername(e.target.value)
                                        }
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label fw-semibold"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete={
                                            isRegister
                                                ? 'new-password'
                                                : 'current-password'
                                        }
                                        required
                                    />
                                </div>
                                {isRegister && (
                                    <>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="form-label fw-semibold"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                className="form-control form-control-lg"
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={e =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>
                                        {requireToken && (
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="signupToken"
                                                    className="form-label fw-semibold"
                                                >
                                                    Signup Token
                                                </label>
                                                <input
                                                    id="signupToken"
                                                    name="signupToken"
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter signup token"
                                                    value={signupToken}
                                                    onChange={e =>
                                                        setSignupToken(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                {errorMessage && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-grid mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />

                                                Please wait...
                                            </>
                                        ) : (
                                            isRegister
                                                ? 'Create Account'
                                                : 'Sign In'
                                        )}
                                    </button>
                                </div>
                                <div className="text-center mt-4">
                                    <span className="text-muted">
                                        {isRegister
                                            ? 'Already have an account? '
                                            : "Don't have an account? "}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-decoration-none fw-semibold"
                                        onClick={swap}
                                        disabled={isLoading}
                                    >
                                        {isRegister
                                            ? 'Sign In'
                                            : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
