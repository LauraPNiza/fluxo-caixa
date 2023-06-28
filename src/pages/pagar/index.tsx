import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import styles from './styles.module.css';
import { db } from '../../services/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

type Payment = {
  id: string;
  amount: number;
  date: number;
  description: string;
};

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [inputAmount, setInputAmount] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState('');
  const [editPaymentDate, setEditPaymentDate] = useState('');
  const [editPaymentDescription, setEditPaymentDescription] = useState('');
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
          description: paymentData.description,
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

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDescription(event.target.value);
  };

  const addPayment = async (event: FormEvent) => {
    event.preventDefault();

    if (inputAmount.trim() !== '' && inputDate.trim() !== '') {
      const newPayment: Payment = {
        id: '',
        amount: parseFloat(inputAmount.trim()),
        date: inputDate.trim(),
        description: inputDescription.trim(),
      };

      try {
        const docRef = await addDoc(collection(db, 'payments'), newPayment);
        newPayment.id = docRef.id;
        setPayments([...payments, newPayment]);
        setInputAmount('');
        setInputDate('');
        setInputDescription('');
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

  const editPayment = (paymentId: string, paymentAmount: number, paymentDate: string, paymentDescription: string) => {
    setStatus(true);
    setEditPaymentId(paymentId);
    setEditPaymentAmount(paymentAmount.toString());
    setEditPaymentDate(paymentDate);
    setEditPaymentDescription(paymentDescription);
  };

  const cancelEdit = () => {
    setStatus(false);
    setEditPaymentId(null);
  };

  const updatePayment = async () => {
    if (editPaymentId && editPaymentAmount.trim() !== '' && editPaymentDate.trim() !== '' && editPaymentDescription.trim() !== '') {
      try {
        const paymentRef = doc(db, 'payments', editPaymentId);
        await updateDoc(paymentRef, {
          amount: parseFloat(editPaymentAmount.trim()),
          date: editPaymentDate.trim(),
          description: editPaymentDescription.trim(),
        });
        const updatedPayments = payments.map((payment) => {
          if (payment.id === editPaymentId) {
            payment.amount = parseFloat(editPaymentAmount.trim());
            payment.date = editPaymentDate.trim();
            payment.description = editPaymentDescription.trim();
          }
          return payment;
        });
        setStatus(false);
        setPayments(updatedPayments);
        setEditPaymentId(null);
        setEditPaymentAmount('');
        setEditPaymentDate('');
        setEditPaymentDescription('');
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
            <h1 className={styles.title}>Adicionar Pagamento</h1>
            <form onSubmit={addPayment}>
              <input
                type="text"
                placeholder="Valor..."
                value={inputAmount}
                onChange={handleAmountChange}
              />
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={inputDate}
                onChange={handleDateChange}
              />
              <input
                type="text"
                placeholder="Descrição..."
                value={inputDescription}
                onChange={handleDescriptionChange}
              />
              <button className={styles.button} type="submit">
                Adicionar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.paymentContainer}>
          <h1>Pagamentos</h1>
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
                    <input
                      type="text"
                      value={editPaymentDescription}
                      onChange={(e) => setEditPaymentDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className={styles.payment}>
                    <article>
                      <span>Valor: </span> {payment.amount}
                    </article>
                    <article>
                      <span>Data: </span>
                      {payment.date}
                    </article>
                    <article>
                      <span>Descrição: </span>
                      {payment.description}
                    </article>
                  </div>
                )}
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => editPayment(payment.id, payment.amount, payment.date, payment.description)}
                >
                  Editar
                </button>
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => deletePayment(payment.id)}
                >
                  Deletar
                </button>
                <br />
                _________________________________
              </li>
            ))}
          </ul>

          {editPaymentId && (
            <div>
              <button className={styles.button} onClick={updatePayment}>
                Atualizar
              </button>
              <button className={styles.button} onClick={cancelEdit}>
                Cancelar
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