'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCredentials } from '@/types';
import { login } from '../api/api';
import { FaAngleLeft } from 'react-icons/fa6';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState<UserCredentials>({
    userIdentifier: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await login(user); // Assuming login API returns { accessToken }
      console.log('Login successful', response);

      // Store token in cookies
      Cookies.set('accessToken', response.data.accessToken, {
        expires: 7,
        secure: true,
      });

      router.push('/tasks');
    } catch (error: any) {
      console.log('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.userIdentifier && user.password));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-10">
        {loading ? "We're logging you in..." : 'Account Login'}
      </h1>
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <input
          className="w-full text-black p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          id="userIdentifier"
          type="userIdentifier"
          value={user.userIdentifier}
          onChange={(e) =>
            setUser({
              ...user,
              userIdentifier: e.target.value.toLowerCase().trim(),
            })
          }
          placeholder="Your Email or Username..."
        />
        <input
          className="w-full text-black p-3 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value.trim() })
          }
          placeholder="Your Password..."
        />
        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 uppercase font-bold ${buttonDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} transition duration-300`}
        >
          Login
        </button>
        <Link href="/sign-up">
          <p className="mt-4 text-center text-gray-400">
            Don't have an account yet?{' '}
            <span className="text-green-500 font-bold cursor-pointer underline">
              Register now
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
