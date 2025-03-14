import React from "react";

export default function QuantityTable({ title, data }) {
  return (
    <div className="col-span-1 border rounded-lg p-4 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-200 mb-3">{title}</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 border text-center text-gray-900 dark:text-gray-200">Khu vực</th>
            <th className="p-2 border text-center text-gray-900 dark:text-gray-200">Số lượng</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(data) && data.length > 0 ? (
    data.map((item, index) => (
      <tr key={index} className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700">
        <td className="p-2 border text-center text-gray-900 dark:text-gray-200">{item.location}</td>
        <td className="p-2 border text-center text-gray-200">{item.count}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="2" className="p-2 border text-center text-gray-500">
        Không có dữ liệu
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}