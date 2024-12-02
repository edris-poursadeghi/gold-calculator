"use client";

import { useState } from "react";

export default function Home() {
  const [usd, setUsd] = useState<string>("");
  const [xau, setXau] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  // Function to format numbers with commas
  const formatNumber = (value: string | number): string =>
    new Intl.NumberFormat("en-US").format(Number(value));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse inputs as numbers
    const usdValue = parseFloat(usd.replace(/,/g, ""));
    const xauValue = parseFloat(xau.replace(/,/g, ""));

    if (isNaN(usdValue) || isNaN(xauValue)) {
      setResult("Please enter valid USD and XAU values.");
      return;
    }

    // Conversion Logic
    // 1. Convert XAU (Gold Price per Ounce) to price per gram in USD
    const goldPricePerGram = xauValue / 31.1035; // USD per gram

    // 2. Calculate price of 1 gram of 18K Gold in USD
    const gold18KPricePerGram = goldPricePerGram * 0.75; // 18K gold is 75% pure

    // 3. Convert the price of 1 gram of 18K gold to Toman
    const pricePerGramInToman = gold18KPricePerGram * usdValue; // Price in Toman

    setResult(
      `The price of 1 gram of 18-karat gold is approximately ${formatNumber(pricePerGramInToman)} Iranian Toman.`
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Remove commas and allow only numbers
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value))) {
      // Format input with commas
      setValue(formatNumber(value));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Gold Price Calculator</h1>

        <label className="block mb-2 font-medium">USD Exchange Rate (1 USD in Toman):</label>
        <input
          type="text"
          value={usd}

          onChange={(e) => handleInputChange(e, setUsd)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter USD rate in Toman (e.g., 71,000)"
        />

        <label className="block mb-2 font-medium">XAU (Gold Price Per Ounce in USD):</label>
        <input
          type="text"
          value={xau}
          onChange={(e) => handleInputChange(e, setXau)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter gold price in USD per ounce 2,640"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-4 p-2 bg-gray-200 rounded">
            <p>{result}</p>
          </div>
        )}
      </form>
    </main>
  );
}
