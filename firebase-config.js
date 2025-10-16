// Firebase Configuration
// Para configurar:
// 1. Vá ao Firebase Console (https://console.firebase.google.com/)
// 2. Selecione seu projeto ou crie um novo
// 3. Vá em Project Settings > General > Your apps
// 4. Clique em Web (</>) e registre o app
// 5. Copie as credenciais e substitua abaixo

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
  // 🔥 SUBSTITUA ESTAS CREDENCIAIS PELAS SUAS DO FIREBASE 🔥
  apiKey: "your-api-key-here", // Encontrado em Project Settings > General > Your apps
  authDomain: "your-project.firebaseapp.com", // Geralmente: seu-projeto.firebaseapp.com
  projectId: "your-project-id", // Nome do seu projeto no Firebase
  storageBucket: "your-project.appspot.com", // Geralmente: seu-projeto.appspot.com
  messagingSenderId: "123456789", // Número encontrado nas configurações
  appId: "your-app-id-here" // String longa encontrada nas configurações
};

// Inicializar Firebase apenas se as configurações forem válidas
let app, auth, db, googleProvider;

if (firebaseConfig.apiKey !== "your-api-key-here") {
  console.log("Firebase configurado com sucesso!");

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  // Configurar Google Provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  console.log("Firebase inicializado!");
} else {
  console.error("❌ Firebase não configurado! Configure as credenciais no arquivo firebase-config.js");
  console.log("📋 Para configurar:");
  console.log("1. Vá ao Firebase Console: https://console.firebase.google.com/");
  console.log("2. Crie um projeto ou selecione um existente");
  console.log("3. Vá em Project Settings > General > Your apps");
  console.log("4. Clique em Web (</>) e registre o app");
  console.log("5. Copie as credenciais e substitua no arquivo firebase-config.js");

  // Criar objetos mock para evitar erros
  app = null;
  auth = null;
  db = null;
  googleProvider = null;
}

// Exportar para uso em outros arquivos
window.firebaseExports = {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp
};
