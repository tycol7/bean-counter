/* eslint-disable require-jsdoc */
import {getProviders, signIn} from 'next-auth/react';
import React from 'react';

type provider = {
    name: string
    id: string
}

type Props = {
    providers: provider[]
}

export default function SignIn({providers}: Props) {
  return (
    <div>
      <main className="flex flex-col w-full min-h-screen items-center
        justify-center text-center py-20 space-y-4">
        <div key="Google">
          <button className="rounded-full bg-blue hover:bg-blue-light
            font-bold text-gray-lightest py-2 px-4"
          onClick={() => signIn('google', {
            callbackUrl: `${window.location.origin}/dashboard`,
          })}>
            Sign in with Google
          </button>
        </div>
        <div key="Guest">
          <button className="rounded-full bg-gray-light hover:bg-gray-lighter
            font-bold py-2 px-4"
          onClick={() => signIn('credentials', {
            callbackUrl: `${window.location.origin}/dashboard`,
          })}>
            Sign in as a Guest
          </button>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {providers},
  };
}
