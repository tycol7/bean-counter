/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
import Transactions from '../../components/Transactions';
import UserInfo from '../../components/UserInfo';

function Dashboard() {
  return (
    <div className="container mx-auto px-4">
      <nav className="flex items-center py-6 px-4">
        <span className="font-semibold text-xl text-gray-lightest">
            Bean Counter 🫘
        </span>
        <UserInfo />
      </nav>
      <main className="border border-gray rounded-3xl p-8">
        <Transactions />
      </main>
    </div>
  );
};

export default Dashboard;
