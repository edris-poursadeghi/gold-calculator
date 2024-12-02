'use client';

import { useState } from "react";

type Position = {
  goldPrice: number;
  goldAmount: number;
  fee: number;
  total: number;
};

const formatNumber = (value: number | string) => {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat().format(num);
};

const parseNumber = (value: string) =>
  parseFloat(value.replace(/,/g, "") || "0");

export default function GoldCalculator() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [goldPrice, setGoldPrice] = useState<string>(""); // Store as a formatted string
  const [amount, setAmount] = useState<string>(""); // Store as a formatted string
  const [goldAmount, setGoldAmount] = useState<string>(""); // Store amount of gold in milligrams

  const handleAddPosition = () => {
    const pricePerMilligram = parseNumber(goldPrice);
    const totalAmount = parseNumber(amount);
    const goldAmountInMilligrams = parseNumber(goldAmount);
    const fee = totalAmount * 0.015; // 1.5% fee
    const total = totalAmount + fee;
    const calculatedGoldAmount =
      goldAmountInMilligrams || (totalAmount / pricePerMilligram) * 1000; // calculate if no gold amount input

    setPositions([
      ...positions,
      {
        goldPrice: pricePerMilligram,
        goldAmount: calculatedGoldAmount,
        fee,
        total,
      },
    ]);
  };

  const calculateAverageGoldPrice = () => {
    let totalPrice = 0;
    positions.forEach((pos) => {
      totalPrice += pos.goldPrice;
    });
    return positions.length > 0 ? totalPrice / positions.length : 0;
  };

  const calculateTotalGold = () => {
    let totalGold = 0;
    positions.forEach((pos) => {
      totalGold += pos.goldAmount;
    });
    return totalGold;
  };

  const handleDeletePosition = (index: number) => {
    const updatedPositions = positions.filter((_, idx) => idx !== index);
    setPositions(updatedPositions);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gold Calculator</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Gold Price (per milligram):
          </label>
          <input
            type="text"
            value={goldPrice}
            onChange={(e) => setGoldPrice(formatNumber(e.target.value))}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Amount you want to pay:
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(formatNumber(e.target.value))}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Amount of Gold (in milligrams) you bought:
          </label>
          <input
            type="text"
            value={goldAmount}
            onChange={(e) => setGoldAmount(formatNumber(e.target.value))}
            className="border rounded w-full p-2"
          />
        </div>

        <button
          onClick={handleAddPosition}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Position
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6">Positions</h2>
      <ul className="space-y-2">
        {positions.map((pos, idx) => (
          <li key={idx} className="p-4 border rounded">
            <p>Gold Price: {formatNumber(pos.goldPrice.toFixed(2))} per mg</p>
            <p>Gold Bought: {formatNumber(pos.goldAmount.toFixed(2))} mg</p>
            <p>Fee: {formatNumber(pos.fee.toFixed(2))}</p>
            <p>Total Paid: {formatNumber(pos.total.toFixed(2))}</p>
            <button
              onClick={() => handleDeletePosition(idx)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              Delete Position
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Summary</h2>
      <p>
        Average Gold Price:{" "}
        {formatNumber(calculateAverageGoldPrice().toFixed(2))} per mg
      </p>
      <p>
        Total Gold Bought: {formatNumber(calculateTotalGold().toFixed(2))} mg
      </p>
    </div>
  );
}
