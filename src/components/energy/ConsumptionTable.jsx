import React from 'react';
import PropTypes from 'prop-types';

const ConsumptionTable = ({ data }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Chênh lệch công suất theo thời gian</h2>
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Thời gian</th>
          <th className="border p-2">Chênh lệch (MW)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="text-center hover:bg-gray-50">
            <td className="border p-2">{row.time}</td>
            <td className="border p-2">{row.deficit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

ConsumptionTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ConsumptionTable;