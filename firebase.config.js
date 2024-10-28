import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDLNOHkLvpU5siViCs-6U01y7W8LoG8i_g",
  authDomain: "yogaapp-9ebe9.firebaseapp.com",
  projectId: "yogaapp-9ebe9",
  storageBucket: "yogaapp-9ebe9.appspot.com",
  messagingSenderId: "289858342631",
  appId: "1:289858342631:web:25b22967c1f40919055c42",
  measurementId: "G-JENL82KV58"
};
  
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

const dbName = 'yoga_classes';

export { db, dbName };

