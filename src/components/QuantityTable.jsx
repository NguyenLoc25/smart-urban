import React from "react";

export default function QuantityTable({ data }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-center">Số lượng vị trí</h2>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-center">
            <th className="border p-2 dark:border-gray-600">Tổng vị trí</th>
            <th className="border p-2 dark:border-gray-600">Đã sử dụng</th>
            <th className="border p-2 dark:border-gray-600">Còn trống</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center bg-white dark:bg-gray-900">
            <td className="border p-2 dark:border-gray-600 font-bold">{data.total}</td>
            <td className="border p-2 dark:border-gray-600 text-red-500">{data.used}</td>
            <td className="border p-2 dark:border-gray-600 text-green-500">{data.available}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
