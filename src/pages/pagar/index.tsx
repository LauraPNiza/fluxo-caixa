import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import styles from './styles.module.css';
import { db } from '../../services/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

type Payment = {
  id: string;
  amount: number;
  date: string;
  person: any; 
};

import persons from '../cadastros';

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [inputAmount, setInputAmount] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState('');
  const [editPaymentDate, setEditPaymentDate] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
      const fetchedPayments: Payment[] = [];
      snapshot.forEach((doc) => {
        const paymentData = doc.data();
        const payment: Payment = {
          id: doc.id,
          amount: paymentData.amount,
          date: paymentData.date,
        };
        fetchedPayments.push(payment);
      });
      setPayments(fetchedPayments);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAmount(event.target.value);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value);
  };

  const addPayment = async (event: FormEvent) => {
    event.preventDefault();

    if (inputAmount.trim() !== '' && inputDate.trim() !== '') {
      const newPayment: Payment = {
        id: '',
        amount: parseFloat(inputAmount.trim()),
        date: inputDate.trim(),
      };

      try {
        const docRef = await addDoc(collection(db, 'payments'), newPayment);
        newPayment.id = docRef.id;
        setPayments([...payments, newPayment]);
        setInputAmount('');
        setInputDate('');
      } catch (error) {
        console.error('Error adding payment to Firestore: ', error);
      }
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      await deleteDoc(doc(db, 'payments', paymentId));
      const updatedPayments = payments.filter((payment) => payment.id !== paymentId);
      setPayments(updatedPayments);
    } catch (error) {
      console.error('Error deleting payment from Firestore: ', error);
    }
  };

  const editPayment = (paymentId: string, paymentAmount: number, paymentDate: string) => {
    setStatus(true);
    setEditPaymentId(paymentId);
    setEditPaymentAmount(paymentAmount.toString());
    setEditPaymentDate(paymentDate);
  };

  const cancelEdit = () => {
    setStatus(false);
    setEditPaymentId(null);
  };

  const updatePayment = async () => {
    if (editPaymentId && editPaymentAmount.trim() !== '' && editPaymentDate.trim() !== '') {
      try {
        const paymentRef = doc(db, 'payments', editPaymentId);
        await updateDoc(paymentRef, {
          amount: parseFloat(editPaymentAmount.trim()),
          date: editPaymentDate.trim(),
        });
        const updatedPayments = payments.map((payment) => {
          if (payment.id === editPaymentId) {
            payment.amount = parseFloat(editPaymentAmount.trim());
            payment.date = editPaymentDate.trim();
          }
          return payment;
        });
        setStatus(false);
        setPayments(updatedPayments);
        setEditPaymentId(null);
        setEditPaymentAmount('');
        setEditPaymentDate('');
      } catch (error) {
        console.error('Error updating payment in Firestore: ', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Add Payment</h1>
            <form onSubmit={addPayment}>
              <input
                type="text"
                placeholder="Enter amount..."
                value={inputAmount}
                onChange={handleAmountChange}
              />
              <input
                type="text"
                placeholder="Enter date..."
                value={inputDate}
                onChange={handleDateChange}
              />
              <button className={styles.button} type="submit">
                Add
              </button>
            </form>
          </div>
        </section>

        <section className={styles.paymentContainer}>
          <h1>Manage Payments</h1>
          <ul>
            {payments.map((payment) => (
              <li key={payment.id} className={styles.payment}>
                {editPaymentId === payment.id ? (
                  <div>
                    <input
                      type="text"
                      value={editPaymentAmount}
                      onChange={(e) => setEditPaymentAmount(e.target.value)}
                    />
                    <input
                      type="text"
                      value={editPaymentDate}
                      onChange={(e) => setEditPaymentDate(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className={styles.payment}>
                    <article>
                      <span>Amount: </span> {payment.amount}
                    </article>
                    <article>
                      <span>Date: </span>
                      {payment.date}
                    </article>
                  </div>
                )}
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => editPayment(payment.id, payment.amount, payment.date)}
                >
                  Edit
                </button>
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => deletePayment(payment.id)}
                >
                  Delete
                </button>
                <br />
                _________________________________
              </li>
            ))}
          </ul>

          {editPaymentId && (
            <div>
              <button className={styles.button} onClick={updatePayment}>
                Update
              </button>
              <button className={styles.button} onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
}