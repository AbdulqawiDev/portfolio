// =========================================
// Firebase Config - مشترك بين index.html و admin.html
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4xNutT_05pBiACw010XZXK8jm54UDC8Y",
    authDomain: "alsalmi-5b590.firebaseapp.com",
    projectId: "alsalmi-5b590",
    storageBucket: "alsalmi-5b590.firebasestorage.app",
    messagingSenderId: "383502478941",
    appId: "1:383502478941:web:1c3d3cf4e87dcbcad6a7b4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);