// import { auth } from "@/lib/firebaseConfig";
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// export async function POST(req) {
//   try {
//     const { email, password, provider } = await req.json();

//     let userCredential;
//     if (provider === "google") {
//       const googleProvider = new GoogleAuthProvider();
//       userCredential = await signInWithPopup(auth, googleProvider);
//     } else {
//       userCredential = await signInWithEmailAndPassword(auth, email, password);
//     }

//     const user = userCredential.user;
//     console.log("User logged in:", user);
//     return Response.json({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 400 });
//   }
// }
