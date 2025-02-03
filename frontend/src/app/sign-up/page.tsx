'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6';
import { register } from '../api/api';

export default function SignUpPage() {
  // Router for navigation
  const router = useRouter();

  // User state
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  // Form control states
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For showing error messages

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasNumber = /[0-9]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasNumber && hasLowercase && hasUppercase && hasSpecialChar;
  };

  // Signup function
  const onSignUp = async () => {
    try {
      setLoading(true);
      setFormError(''); // Clear any previous error

      // Call the register function from the API module
      const response = await register(user);
      console.log('Signup successful', response);

      router.push('/login');
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 400) {
        setUser((prev) => ({ ...prev, password: '', username: '', email: '' })); // Clear fields
        setTouched({ password: false, email: false });
        setFormError(
          error.response.data?.message || 'An error occurred during signup.',
        );
      } else {
        setFormError('Unexpected error occurred. Please try again later.');
        console.log('Failed to sign up the user', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate inputs and set button state
  useEffect(() => {
    const { email, password } = user;
    setButtonDisabled(
      !(
        user.username &&
        user.firstName &&
        user.lastName &&
        validateEmail(email) &&
        validatePassword(password)
      ),
    );
    setErrors({
      email: validateEmail(user.email) ? '' : 'Invalid email address',
      password: validatePassword(user.password)
        ? ''
        : 'Password must include numbers, lowercase, uppercase, and special characters',
    });
  }, [user]);

  // Handle input changes
  const handleInputChange = (field: any, value: any) => {
    setUser({ ...user, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-10">
        {loading ? 'Processing...' : 'Free Sign Up'}
      </h1>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <input
          className="w-full text-black p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          id="firstName"
          type="text"
          value={user.firstName}
          onChange={(e) =>
            handleInputChange('firstName', e.target.value.trim())
          }
          placeholder="Your First Name..."
        />

        <input
          className="w-full text-black p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          id="lastName"
          type="text"
          value={user.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value.trim())}
          placeholder="Your Last Name..."
        />

        <input
          className="w-full text-black p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          id="username"
          type="text"
          value={user.username}
          onChange={(e) =>
            handleInputChange('username', e.target.value.toLowerCase().trim())
          }
          placeholder="Your Username..."
        />

        <input
          className={`w-full text-black p-3 border ${
            touched.email && errors.email ? 'border-red-600' : 'border-gray-600'
          } rounded-lg mb-4 focus:outline-none focus:border-gray-400`}
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => handleInputChange('email', e.target.value.trim())}
          placeholder="Your Email..."
        />
        {touched.email && errors.email && (
          <p className="text-red-600 text-sm mb-4">{errors.email}</p>
        )}

        <input
          className={`w-full text-black p-3 border ${
            touched.password && errors.password
              ? 'border-red-600'
              : 'border-gray-600'
          } rounded-lg mb-4 focus:outline-none focus:border-gray-400`}
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => handleInputChange('password', e.target.value.trim())}
          placeholder="Your Password..."
        />
        {touched.password && errors.password && (
          <p className="text-red-600 text-sm mb-4">{errors.password}</p>
        )}

        <button
          onClick={onSignUp}
          disabled={buttonDisabled}
          className={`w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 uppercase font-bold ${
            buttonDisabled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800'
          } transition duration-300`}
        >
          {buttonDisabled ? 'Sign Up' : 'Register My Account Now'}
        </button>

        {formError && <p className="text-red-600 text-sm mt-4">{formError}</p>}

        <Link href="/login">
          <p className="mt-4 text-center text-gray-400">
            Already have an account?{' '}
            <span className="text-green-500 font-bold cursor-pointer underline">
              Log in to your account
            </span>
          </p>
        </Link>

        <Link href="/">
          <p className="mt-8 text-center text-gray-400">
            <FaAngleLeft className="inline mr-1" /> Back to the Homepage
          </p>
        </Link>
      </div>
    </div>
  );
}
