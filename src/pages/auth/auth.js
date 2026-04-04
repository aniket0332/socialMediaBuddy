import React, { useState } from 'react';
import { login, signUp, confirmSignUp } from '../../services/auth.service';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userName: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one capital letter";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showConfirmation)
      return;
    try {
      if (validateForm()) {
        isLogin ? await login(formData.email, formData.password) : await signUp(formData.email, formData.userName, formData.password, setShowConfirmation);
        toast.success(isLogin ? 'Login Successfull' : 'account Created');
        if(isLogin){
          console.log('faaa')
          navigate('/');
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignUp(formData.userName, code);
      toast.success("Account verified successfully!");
      setShowConfirmation(false);
      setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      userName: ''
    });
      isLogin(true);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      userName: ''
    });
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to your ToneBuddy account'
            : 'Join ToneBuddy to transform your text'
          }
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">User name</label>
            <input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`form-input`}
              placeholder='Enter your userName'
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder='Enter your  email'
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}
          {!isLogin && showConfirmation && <div>
            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirmation Code</label>
              <input
                id="confirmPassword"
                placeholder="Enter verification code"
                className='form-input'
                onChange={(e) => setCode(e.target.value)}
              /><br />
              <button type='button' className="auth-btn" onClick={handleConfirm}>Confirm</button>
            </div>
          </div>}
          {!showConfirmation && <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>}
        </form>
        {!showConfirmation && <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={toggleMode} className="toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>}
      </div>
    </div>
  );
}

export default Auth;
