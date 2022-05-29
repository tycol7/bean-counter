/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <main className="flex flex-col w-full min-h-screen items-center
        justify-center text-center py-20">
        <h1 className="text-5xl font-bold text-gray-lightest">
          Welcome to Bean Counter 🫘
        </h1>
        <p className="mt-6">
          <Link href="/dashboard">
            <button className="rounded-full bg-blue hover:bg-blue-light
            font-bold text-gray-lightest py-2 px-4">
              Get Started
            </button>
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Home;
