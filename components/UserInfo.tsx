/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
import {useSession, signOut} from 'next-auth/react';
import {Menu} from '@headlessui/react';

export default function UserInfo() {
  const {data: session} = useSession();

  if (session) {
    return (
      <div className="ml-auto">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button>
            <img className="w-10 rounded-full hover:cursor-pointer hover:ring-4
            hover:ring-gray m-1" src={session.user.image}
            alt="Profile" />
          </Menu.Button>
          <Menu.Items as="section" className="absolute right-0 mt-2 w-56
          p-2 origin-top-right rounded-md bg-gray-dark ring-1 ring-gray
          focus:outline-none">
            <Menu.Item>
              {({active}) => (
                <>
                  <p className="font-medium text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-light border-b
                  border-gray pb-2">
                    {session.user.email}
                  </p>
                </>
              )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <button onClick={() => signOut({
                  callbackUrl: `${window.location.origin}`,
                })} className={`${
                active ? 'text-gray-lightest' : 'text-blue-lighter'} 
                w-full text-left font-medium text-sm mt-2`}>Logout</button>
              )}
            </Menu.Item>
          </Menu.Items>
          {/* <h2>Welcome, {session.user.name} </h2>
        <p>Signed in as {session.user.email}</p>
        <p>UserId: {session.user.id}</p>
        <p>Admin?: {session.user.admin.toString()}</p>
        <button onClick={() => signOut()}>Sign out</button> */}
        </Menu>
      </div>
    );
  }
  return <></>;
}
