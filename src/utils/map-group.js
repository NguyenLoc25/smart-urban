/**
 * Chuyển nhãn gốc → 3 nhóm rác (O: Organic, R: Recyclable, N: Non-recyclable)
 * Bạn điều chỉnh bảng ánh xạ này theo mô hình thực tế.
 */
export function toGroup(label) {
  if (label === 'food_waste') return 'O';                       // hữu cơ
  if (label === 'paper_box' || label === 'plastic_bottle') return 'R'; // tái chế
  return 'N';                                                   // còn lại
}
