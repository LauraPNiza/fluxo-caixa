import { initializeApp } from "firebase/app"
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDq9AtIdHtax9P0NO2tbzzAsBdT0NXzUCs",
  authDomain: "projeto-erp-44442.firebaseapp.com",
  projectId: "projeto-erp-44442",
  storageBucket: "projeto-erp-44442.appspot.com",
  messagingSenderId: "1052257859514",
  appId: "1:1052257859514:web:a6e20febe7313aaca50f83"
}

const firebaseApp = initializeApp(firebaseConfig)

const db =getFirestore(firebaseApp)
export {db}