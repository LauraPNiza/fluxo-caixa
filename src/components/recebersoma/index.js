import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'

export function ReceberSoma(){

    const [recivedBill, setRecivedBill] = useState(0)

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

    return(
        <article className={styles.card}>
                        <h3>Contas Recebidas</h3>
                        <span>{recivedBill}</span>
                    </article>
    )
}