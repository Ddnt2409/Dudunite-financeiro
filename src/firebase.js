// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do seu Firebase (Dudunite-financeiro)
const firebaseConfig = {
  apiKey: "AIzaSyA6FAbMC67qxiD3zDNYzs7HiCNsYGUce5k",
  authDomain: "dudunite-financeiro.firebaseapp.com",
  projectId: "dudunite-financeiro",
  storageBucket: "dudunite-financeiro.firebasestorage.app",
  messagingSenderId: "1002980268849",
  appId: "1:1002980268849:web:ad55eea99700bab55dee10"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
const db = getFirestore(app);

export default db;
