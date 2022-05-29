/* eslint-disable require-jsdoc */
import React from 'react';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div>
      <main className="flex flex-col w-full min-h-screen items-center
        justify-center text-center py-20">
        <h1 className="text-3xl font-bold text-gray-lightest">
          Access denied
        </h1>
        <Link href="/signin">
          <button className="mt-5 rounded-full bg-blue hover:bg-gray-lightest
            hover:text-blue font-bold text-gray-lightest py-2 px-4">
              Try a different account?
          </button>
        </Link>
      </main>
    </div>
  );
}
