// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCILTErIubtixyLmF5reZImCxG6B2AWnSI",
  authDomain: "kitchennotify-206cd.firebaseapp.com",
  projectId: "kitchennotify-206cd",
  storageBucket: "kitchennotify-206cd.appspot.com",
  messagingSenderId: "510550210445",
  appId: "1:510550210445:web:040ebb9a08afdaf4396fc4",
  measurementId: "G-VP1G6VFXJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
      const token = await getToken(messaging, {
      vapidKey: "BBxGBPiP6nXTR2Nz_HscBEPx4gEHyyfedFQBIiHEWVpTdZp3JLS1rHL8ps5IlgxKiRWHPCSV6aoggpXDMOktaMk"
    })
    return token
  }
}