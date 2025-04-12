"use client";

import { useState } from "react";

export default function CityConsumption() {
  const [selectedDate, setSelectedDate] = useState("");
  const [production, setProduction] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !production) {
      setMessage("❌ Vui lòng chọn ngày và nhập sản lượng.");
      return;
    }

    const dateObj = new Date(selectedDate);
    const payload = {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1, // JS months: 0-11
      day: dateObj.getDate(),
      production: parseFloat(production),
    };

    const response = await fetch("/api/energy/city", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      setMessage(`✅ Đã lưu dữ liệu cho ngày ${payload.day}/${payload.month}/${payload.year}`);
    } else {
      setMessage(`❌ Lỗi: ${result.error}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Nhập sản lượng điện</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Chọn ngày:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sản lượng điện (kWh):</label>
          <input
            type="number"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gửi dữ liệu
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
