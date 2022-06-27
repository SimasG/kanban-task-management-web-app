// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSfa0H00WHmU2sru8hxcF5GUUw4xMcies",
  authDomain: "kanban-task-management-web-app.firebaseapp.com",
  projectId: "kanban-task-management-web-app",
  storageBucket: "kanban-task-management-web-app.appspot.com",
  messagingSenderId: "429751481231",
  appId: "1:429751481231:web:1c0f295c7f8440d3a411fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
