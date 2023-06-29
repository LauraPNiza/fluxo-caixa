import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'

export function Saldo() {
  const [paymentsBill, setPaymentsBill] = useState(0)
  const [recivedBill, setRecivedBill] = useState(0)
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
      let totalToPay = 0

      snapshot.forEach((doc) => {
        const paymentData = doc.data();
        const amount = paymentData.amount

        if (amount < 0) {
          totalToPay += Math.abs(amount)
        } else {
          totalToPay += amount
        }
      })

      setPaymentsBill(totalToPay)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'billsToReceive'), (snapshot) => {
      let totalToReceive = 0

      snapshot.forEach((doc) => {
        const billsToReceived = doc.data()
        const amount = billsToReceived.amount

        if (amount < 0) {
          totalToReceive += Math.abs(amount)
        } else {
          totalToReceive += amount
        }
      })

      setRecivedBill(totalToReceive)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const calculatedSaldo = recivedBill - paymentsBill
    setSaldo(calculatedSaldo)
  }, [recivedBill, paymentsBill])

  return (
    <article className={styles.card}>
      <h3>Saldo fluxo caixa</h3>
      <span>{saldo}</span>
    </article>
  )
}