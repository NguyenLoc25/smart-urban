import { auth, googleProvider } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Đăng ký tài khoản
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Đăng nhập bằng email & password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Đăng nhập với Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy thông tin người dùng từ localStorage
export const getUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

// Đăng xuất
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user"); // Xóa user khỏi localStorage
    return true; // Trả về trạng thái đăng xuất thành công
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lắng nghe thay đổi trạng thái đăng nhập
export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Lưu user khi đăng nhập
    } else {
      localStorage.removeItem("user"); // Xóa user khi đăng xuất
    }
    callback(user);
  });
};
