import admin from "firebase-admin";
import dotenv from 'dotenv';
dotenv.config(); 
let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
} catch (error) {
    console.error("🔥 Firebase JSON parse error:", error);
    serviceAccount = {};
}

if (!serviceAccount.project_id || !serviceAccount.databaseURL) {  // 🔥 Kiểm tra databaseURL
    throw new Error("🔥 Firebase initialization error: Missing 'project_id' or 'databaseURL' in service account JSON.");
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,  // ✅ Thêm databaseURL
    });
}

const db = admin.database();
console.log("🔥 Firebase Admin initialized", db);

export { db };
export default admin;
