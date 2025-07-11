// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔧 Pode preencher com "..." por enquanto só para passar o build
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
const db = getFirestore(app);

export { db };
