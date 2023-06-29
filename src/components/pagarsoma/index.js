import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'

export function PagarSoma(){

    const [paymentsBill, setPaymentsBill] = useState(0)
    
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
        let totalToPay = 0
    
        snapshot.forEach((doc) => {
            const paymentData = doc.data()
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

    return(
        <article className={styles.card}>
            <h3>Contas Pagas</h3>
            <span>{paymentsBill}</span>
        </article>
    )
}
    