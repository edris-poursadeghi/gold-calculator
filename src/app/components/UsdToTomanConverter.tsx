'use client';

import { useState } from 'react';

type Transaction = {
  usdAmount: number;
  exchangeRate: number;
};

const formatNumber = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat().format(num);
};

const parseNumber = (value: string) => parseFloat(value.replace(/,/g, '') || '0');

export default function UsdAveragePurchase() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<string>('');

  // Function to add a transaction
  const handleAddTransaction = () => {
    const usd = parseNumber(usdAmount);
    const rate = parseNumber(exchangeRate);

    // Add the transaction to the state
    setTransactions([
      ...transactions,
      { usdAmount: usd, exchangeRate: rate },
    ]);

    // Clear inputs
    setUsdAmount('');
    setExchangeRate('');
  };

  // Calculate total USD across all transactions
  const calculateTotalUsd = () => {
    return transactions.reduce((total, transaction) => total + transaction.usdAmount, 0);
  };

  // Calculate average exchange rate (average of all entered exchange rates)
  const calculateAverageRate = () => {
    let totalRate = 0;
    transactions.forEach((transaction) => {
      totalRate += transaction.exchangeRate;
    });
    return transactions.length > 0 ? totalRate / transactions.length : 0;
  };

  // Calculate total Toman spent across all transactions
  const calculateTotalTomanSpent = () => {
    return transactions.reduce(
      (total, transaction) => total + transaction.usdAmount * transaction.exchangeRate,
      0
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">USD Purchase Average</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            USD Amount:
          </label>
          <input
            type="text"
            value={usdAmount}
            onChange={(e) => setUsdAmount(formatNumber(e.target.value))}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Exchange Rate (Toman per 1 USD):
          </label>
          <input
            type="text"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(formatNumber(e.target.value))}
            className="border rounded w-full p-2"
          />
        </div>

        <button
          onClick={handleAddTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction, idx) => (
          <li key={idx} className="p-4 border rounded">
            <p>USD Amount: {formatNumber(transaction.usdAmount.toFixed(2))} USD</p>
            <p>Exchange Rate: {formatNumber(transaction.exchangeRate.toFixed(2))} Toman</p>
            <p>Total Toman Spent: {formatNumber((transaction.usdAmount * transaction.exchangeRate).toFixed(2))} Toman</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Summary</h2>
      <p>Total USD Purchased: {formatNumber(calculateTotalUsd().toFixed(2))} USD</p>
      <p>Average Exchange Rate: {formatNumber(calculateAverageRate().toFixed(2))} Toman</p>
      <p>Total Toman Spent: {formatNumber(calculateTotalTomanSpent().toFixed(2))} Toman</p>
    </div>
  );
}
