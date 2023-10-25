import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {

  apiKey: "AIzaSyCBeaS4uU3zZwygXVEc17BfFreVONW57sk",

  authDomain: "placemaster-50e4b.firebaseapp.com",

  projectId: "placemaster-50e4b",

  storageBucket: "placemaster-50e4b.appspot.com",

  messagingSenderId: "354661878824",

  appId: "1:354661878824:web:8fc6a8e6684706ad90f91d",

  measurementId: "G-W2F664SF6X"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
