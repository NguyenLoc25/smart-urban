// /* file: index.jsx */

// const CalendarBox = () => {
//   return (
//     <>
//       <div className="w-full max-w-full rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
//         <table className="w-full">
//           <thead>
//             <tr className="grid grid-cols-7 rounded-t-[10px] bg-[#6366F1] text-white">
//               {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => (
//                 <th
//                   key={i}
//                   className={`flex h-15 items-center justify-center p-1 text-body-xs font-medium sm:text-base xl:p-5 ${i === 0 ? "rounded-tl-[10px]" : i === 6 ? "rounded-tr-[10px]" : ""}`}
//                 >
//                   <span className="hidden lg:block">{day}</span>
//                   <span className="block lg:hidden">{day.slice(0, 3)}</span>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {[...Array(5)].map((_, weekIndex) => (
//               <tr key={weekIndex} className="grid grid-cols-7">
//                 {[...Array(7)].map((_, dayIndex) => {
//                   const date = weekIndex * 7 + dayIndex + 1;
//                   const events = {
//                     1: { name: "Redesign Website", range: "1 Dec - 2 Dec" },
//                     25: { name: "App Design", range: "25 Dec - 27 Dec" },
//                   };

//                   const isEvent = !!events[date];

//                   return (
//                     <td
//                       key={dayIndex}
//                       className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 md:h-25 md:p-6 xl:h-31 flex flex-col items-center justify-start text-center ${
//                         weekIndex === 4 && dayIndex === 0
//                           ? "rounded-bl-[10px]"
//                           : weekIndex === 4 && dayIndex === 6
//                           ? "rounded-br-[10px]"
//                           : ""
//                       }`}
//                     >
//                       <div className="text-xs font-bold text-dark dark:text-white mb-1">
//                         {date}
//                       </div>
//                       {isEvent && (
//                         <div className="mt-1 flex h-full w-full items-center justify-center">
//                           <div className="inline-block rounded bg-green-700 px-2 py-1 text-xs font-semibold text-white max-w-[95%] truncate">
//                             {events[date].name}
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default CalendarBox;
