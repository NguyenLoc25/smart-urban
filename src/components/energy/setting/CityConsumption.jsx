"use client";

import { useState, useEffect } from "react";

export default function CityConsumption() {
  const [selectedDate, setSelectedDate] = useState("");
  const [production, setProduction] = useState("");
  const [message, setMessage] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved data on component mount
  useEffect(() => {
    fetchSavedData();
  }, []);

  const fetchSavedData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/energy/city");
      const result = await response.json();
      
      if (result.success) {
        // Ensure we're setting an array, even if empty
        setSavedData(Array.isArray(result.data) ? result.data : []);
      } else {
        setMessage(`❌ Lỗi khi tải dữ liệu: ${result.error || 'Unknown error'}`);
        setSavedData([]); // Reset to empty array on error
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
      setSavedData([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !production) {
      setMessage("❌ Vui lòng chọn ngày và nhập sản lượng.");
      return;
    }

    const dateObj = new Date(selectedDate);
    const payload = {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
      production: parseFloat(production),
    };

    setIsLoading(true);
    try {
      // Check if data for this date already exists
      const existingData = savedData.find(
        (item) =>
          item.year === payload.year &&
          item.month === payload.month &&
          item.day === payload.day
      );

      const method = existingData ? "PUT" : "POST";
      const url = existingData
        ? `/api/energy/city?id=${existingData._id}`
        : "/api/energy/city";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(
          existingData
            ? `✅ Đã cập nhật dữ liệu cho ngày ${payload.day}/${payload.month}/${payload.year}`
            : `✅ Đã lưu dữ liệu mới cho ngày ${payload.day}/${payload.month}/${payload.year}`
        );
        fetchSavedData(); // Refresh the list
        setSelectedDate("");
        setProduction("");
      } else {
        setMessage(`❌ Lỗi: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/energy/city?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setMessage("✅ Đã xóa dữ liệu thành công");
        fetchSavedData(); // Refresh the list
      } else {
        setMessage(`❌ Lỗi khi xóa: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Nhập sản lượng điện</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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
            step="0.01"
            min="0"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Gửi dữ liệu"}
        </button>
      </form>

      {message && (
        <p className={`my-4 text-center text-sm ${
          message.includes("✅") ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}

<div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Dữ liệu đã lưu</h3>
        {isLoading && savedData.length === 0 ? (
          <p>Đang tải dữ liệu...</p>
        ) : savedData.length === 0 ? (
          <p>Chưa có dữ liệu nào được lưu</p>
        ) : (
          <div className="overflow-x-auto">
  <table className="min-w-full border">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">Ngày</th>
        <th className="border p-2">Sản lượng (kWh)</th>
        <th className="border p-2">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(savedData) && savedData.map((item) => (
        <tr key={item.id}>
          <td className="border p-2 text-center">
            {item.day}/{item.month}/{item.year}
          </td>
          <td className="border p-2 text-center">
            {item.production?.toLocaleString()}
          </td>
          <td className="border p-2 text-center">
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
              disabled={isLoading}
            >
              Xóa
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </div>
    </div>
  );
}