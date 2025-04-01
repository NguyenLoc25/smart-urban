// import React from "react";
// import Plot from "react-plotly.js";

// export default function ResultChart({ data, colors }) {
//   return (
//     <Plot
//       data={[
//         {
//           x: data.map((d) => d.time), // Trục X là thời gian
//           y: data.map((d) => d.deficit), // Trục Y là mức chênh lệch
//           type: "bar",
//           marker: { color: colors.deficit, opacity: 0.7 }, // Màu + hiệu ứng mờ
//           name: "Chênh lệch (MW)",
//         },
//       ]}
//       layout={{
//         title: "Biểu đồ Chênh lệch Năng lượng",
//         xaxis: { title: "Thời gian" },
//         yaxis: { title: "Chênh lệch (MW)" },
//         plot_bgcolor: "#f5f5f5",
//         paper_bgcolor: "#ffffff",
//       }}
//       style={{ width: "100%", height: "300px" }}
//       config={{ responsive: true }}
//     />
//   );
// }
