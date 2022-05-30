/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable require-jsdoc */
import useSWR from 'swr';
import {format} from 'date-fns';
import Price from './Price';
import {Dialog} from '@headlessui/react';
import React, {useState, useRef} from 'react';
import FeatherIcon from 'feather-icons-react';
import FormData from 'form-data';
import axios from 'axios';

type Transaction = {
    id: number
    transactionDate: string
    description: string
    type: string
    amount: number
    attachment: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Transactions() {
  const {data, error} = useSWR('/api/transactions', fetcher);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  /* Added for accessibility */
  /* https://headlessui.dev/react/dialog#managing-initial-focus */
  const completeButtonRef = useRef(null);

  if (error) return <p>Failed to load transactions.</p>;
  if (!data) return <p>Loading transactions.</p>;

  const balance = data[0];
  const transactions: Transaction[] = data[1];

  /* https://github.com/leerob/nextjs-gcp-storage/blob/main/pages/index.js */
  const addTransaction = async (event: React.ChangeEvent<any>) => {
    event.preventDefault(); // Prevents default form submit behavior
    const jsonData = {};
    if (event.target.attachment.files[0]) {
      /* Upload file to Google Cloud */
      const file = event.target.attachment.files[0];
      const filename = encodeURIComponent(file.name);
      const res = await fetch(`/api/transactions/upload-url?file=${filename}`);
      const {url, fields} = await res.json();
      const formData = new FormData();

      Object.entries({...fields, file}).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const uploadOptions = {
        method: 'POST',
        body: formData,
      };

      /* TODO: Fix `any` workarounds. See:
      https://github.com/form-data/form-data/issues/512 */
      const upload = await fetch(url, uploadOptions as any);
      if (upload.ok) {
        jsonData['fileName'] = filename;
      }
    }
    /* Save transaction to database */
    const formData = new FormData(event.target);
    (formData as any).forEach((value, key) => {
      if (key != 'attachment') {
        jsonData[key] = value;
      }
    });
    axios.post('/api/transactions/create', jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      /* TODO: Update the balance and transactions without reloading page */
      alert('Transaction added!');
      window.location.reload();
    }).catch((err) => {
      setMessage('Something went wrong. Please try again.');
    });
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal(event?: KeyboardEvent |
    React.MouseEvent<HTMLButtonElement, MouseEvent>
   | boolean) {
    if (typeof(event) == 'object') {
      event.preventDefault();
    }
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex flex-wrap text-gray-lightest">
        <div className="mb-2">
          <div>
            <h2 className="w-64 text-3xl font-bold">Balance</h2>
            <p className="mt-2 text-2xl font-light">
              {balance ? <Price amount={balance} /> : `$0.00`}
            </p>
          </div>
          <div className="flex justify-start flex-col mt-4
          sm:flex-row sm:space-x-4">
            <h2 className="text-3xl font-bold">Transactions</h2>
            <button className="rounded-full bg-blue hover:bg-blue-light
            font-bold text-gray-lightest py-2 px-4 w-fit mt-2 sm:mt-0"
            onClick={openModal}>
              Add Transaction
            </button>
          </div>
          {message && (
            <div>
              <p className="my-2">{message}</p>
            </div>
          )
          }
        </div>
        {transactions.length != 0 ? (
          <div className="w-full overflow-x-scroll">
            <div className="table table-auto w-full text-sm">
              <div className="table-header-group font-bold">
                <div className="table-row">
                  <div className="table-cell border-b p-4 border-gray text-left
              uppercase text-gray-light text-sm`">
                Date
                  </div>
                  <div className="table-cell border-b p-4 border-gray text-left
              uppercase text-gray-light text-sm">
                Description
                  </div>
                  <div className="table-cell border-b p-4 border-gray text-left
              uppercase text-gray-light text-sm">
                Debit
                  </div>
                  <div className="table-cell border-b p-4 border-gray text-left
              uppercase text-gray-light text-sm">
                Credit
                  </div>
                  <div className="table-cell border-b p-4 border-gray text-left
              uppercase text-gray-light text-sm">
                Attachment
                  </div>
                </div>
              </div>
              <div className="table-row-group">
                {transactions.map((transaction) => (
                  <div className="table-row" key={transaction.id}>
                    <div className="table-cell border-b p-4 border-gray">
                      {format(new Date(transaction.transactionDate),
                          'MMM dd, yyyy',
                      )}
                    </div>
                    <div className="table-cell border-b p-4 border-gray">
                      {transaction.description}
                    </div>
                    <div className="table-cell border-b p-4 border-gray">
                      <Price amount={transaction.type === 'DEBIT' &&
                   transaction.amount} />
                    </div>
                    <div className="table-cell border-b p-4 border-gray">
                      <Price amount={transaction.type === 'CREDIT' &&
                   transaction.amount} />
                    </div>
                    <div className="table-cell align-middle flex border-b
                  p-4 border-gray">
                      {transaction.attachment && (
                        <a
                          href={`https://storage.googleapis.com/bean-counter/${transaction.attachment}`} rel="noreferrer" target="_blank">
                          <FeatherIcon icon="paperclip" size={16}
                            className="hover:text-white hover:cursor-pointer" />
                        </a>
                      )
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>) :
          <p className="mt-4">No transactions yet. Add one to start!</p>
        }
      </div>
      <Dialog as="div" className="relative z-10" open={isOpen}
        onClose={closeModal} initialFocus={completeButtonRef}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4
          text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden
            rounded-2xl bg-gray text-gray-lightest p-6 text-left align-middle
            border border-gray-light shadow-xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                Add Transaction
              </Dialog.Title>
              <form onSubmit={addTransaction}>
                <label className="block mt-2" htmlFor="description">
                  <span className="text-gray-lightest">Description</span>
                  <input type="text" id="description" name="description"
                    required className="mt-1 block w-full rounded-md
                bg-gray border-gray-light shadow-sm text-white
                focus:ring focus:ring-blue-lighter focus:ring-opacity-50" />
                </label>
                <label className="block mt-2" htmlFor="date">
                  <span className="text-gray-lightest">Date</span>
                  <input type="date" id="date" name="date" required
                    className="mt-1 block w-full rounded-md
                bg-gray border-gray-light shadow-sm text-white
                focus:ring focus:ring-blue-lighter focus:ring-opacity-50" />
                </label>
                <label className="block mt-2" htmlFor="amount">
                  <span className="text-gray-lightest">Amount</span>
                  <input type="number" id="amount" name="amount" step="any"
                    required
                    className="mt-1 block w-40 rounded-md
                bg-gray border-gray-light shadow-sm text-white
                focus:ring focus:ring-blue-lighter focus:ring-opacity-50" />
                </label>
                <label className="inline-flex items-center mt-2">
                  <input type="radio" name="type" value="CREDIT"
                    defaultChecked={true}
                    className="mt-1 rounded bg-gray border-gray-light shadow-sm
                  focus:ring focus:ring-blue-light focus:ring-opacity-50" />
                  <span className="text-gray-lightest ml-2">Credit</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="type" value="DEBIT"
                    className="mt-1 ml-4 rounded bg-gray border-gray-light
                  shadow-sm focus:ring focus:ring-blue-light
                  focus:ring-opacity-50" />
                  <span className="text-gray-lightest ml-2">Debit</span>
                </label>
                <label className="block mt-2">
                  <span className="text-gray-lightest">Attachment
                  (.pdf, .png, or .jpeg)</span>
                  <input type="file" id="attachment" name="attachment"
                    className="file:mt-1 block w-full file:text-gray-lightest
                file:rounded-full file:border-none file:bg-gray-light file:px-2
                file:py-1 hover:file:bg-gray-lighter
                hover:file:cursor-pointer"
                    accept="image/jpeg, image/png, application/pdf" />
                </label>
                <div className="flex">
                  <button type="submit"
                    className="block mt-4 rounded-full bg-blue px-3
              font-medium py-1 hover:bg-blue-light"
                    ref={completeButtonRef}>
                Save
                  </button>
                  <button className="block mt-4 ml-2 rounded-full bg-gray-light
                px-3 font-medium py-1 hover:bg-gray-lighter"
                  onClick={closeModal}>
                Cancel
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
