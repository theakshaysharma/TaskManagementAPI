'use client';

import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
      <h1 className="text-7xl font-bold mb-8 text-center">return from index</h1>

      <div className="flex space-x-6">
        <Link href="/login">
          <button className="bg-blue-800 px-8 py-3 rounded-full font-bold text-xl hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="bg-green-800 px-8 py-3 rounded-full font-bold text-xl hover:bg-green-600 transition duration-300">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
