import { NextResponse } from "next/server";
import { auth } from "@/lib/firebaseConfig";

export async function middleware(req) {
  // Kiểm tra người dùng đã đăng nhập chưa
  const user = auth.currentUser;

  // Nếu không có user, chuyển hướng về trang đăng nhập
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu đã đăng nhập, tiếp tục request
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ["/src/app/energy/page.js"], // Các đường dẫn cần bảo vệ
};
