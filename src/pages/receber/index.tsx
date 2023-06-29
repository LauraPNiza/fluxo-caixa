import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import styles from './styles.module.css';
import { db } from '../../services/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

type Person = {
  id: string
  name: string
}

type Bill = {
  id: string
  amount: number
  date: string
  description: string
  personId: string
}

export default function BillManagement() {
  const [bills, setBills] = useState<Bill[]>([])
  const [persons, setPersons] = useState<Person[]>([])
  const [inputBillAmount, setInputBillAmount] = useState('')
  const [inputBillDate, setInputBillDate] = useState('')
  const [inputBillDescription, setInputBillDescription] = useState('')
  const [selectedPerson, setSelectedPerson] = useState('')
  const [editBillId, setEditBillId] = useState<string | null>(null)
  const [editBillAmount, setEditBillAmount] = useState('')
  const [editBillDate, setEditBillDate] = useState('')
  const [editBillDescription, setEditBillDescription] = useState('')
  const [status, setStatus] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'billsToReceive'), (snapshot) => {
      const fetchedBills: Bill[] = []
      snapshot.forEach((doc) => {
        const billData = doc.data()
        const bill: Bill = {
          id: doc.id,
          amount: billData.amount,
          date: billData.date,
          description: billData.description,
          personId: billData.personId,
        }
        fetchedBills.push(bill)
      })
      setBills(fetchedBills)
    })
  
    fetchData()
  
    return () => {
      unsubscribe()
    }
  }, [])

  const handleBillAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputBillAmount(event.target.value)
  }

  const handleBillDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputBillDate(event.target.value)
  }

  const handleBillDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputBillDescription(event.target.value)
  }

  const handlePersonChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerson(event.target.value)
  }

  const addBill = async (event: FormEvent) => {
    event.preventDefault()

    if (
      inputBillAmount.trim() !== '' &&
      inputBillDate.trim() !== '' &&
      inputBillDescription.trim() !== '' &&
      selectedPerson.trim() !== ''
      ) {
      const newBill: Bill = {
        id: '',
        amount: parseFloat(inputBillAmount.trim()),
        date: inputBillDate.trim(),
        description: inputBillDescription.trim(),
        personId: selectedPerson.trim(),
      }

      try {
        const docRef = await addDoc(collection(db, 'billsToReceive'), newBill)
        newBill.id = docRef.id
        setBills([...bills, newBill])
        setInputBillAmount('')
        setInputBillDate('')
        setInputBillDescription('')
        setSelectedPerson('')
      } catch (error) {
        console.error(error)
      }
    }
  }

  const deleteBill = async (billId: string) => {
    try {
      await deleteDoc(doc(db, 'billsToReceive', billId))
      const updatedBills = bills.filter((bill) => bill.id !== billId)
      setBills(updatedBills)
    } catch (error) {
      console.error(error)
    }
  }

  const editBill = (
    billId: string, 
    billAmount: number, 
    billDate: string, 
    billDescription: string,
    billPersonId: string,
    ) => {
    setStatus(true)
    setEditBillId(billId)
    setEditBillAmount(billAmount.toString())
    setEditBillDate(billDate)
    setEditBillDescription(billDescription)
    setSelectedPerson(billPersonId)
  }

  const cancelEdit = () => {
    setStatus(false)
    setEditBillId(null)
  }

  const updateBill = async () => {
    if (editBillId && editBillAmount.trim() !== '' && editBillDate.trim() !== '' && editBillDescription.trim() !== '') {
      try {
        const billRef = doc(db, 'billsToReceive', editBillId)
        await updateDoc(billRef, {
          amount: parseFloat(editBillAmount.trim()),
          date: editBillDate.trim(),
          description: editBillDescription.trim(),
          personId: selectedPerson.trim(),
        })
        const updatedBills = bills.map((bill) => {
          if (bill.id === editBillId) {
            bill.amount = parseFloat(editBillAmount.trim())
            bill.date = editBillDate.trim()
            bill.description = editBillDescription.trim()
            bill.personId = selectedPerson.trim()
          }
          return bill
        })
        setStatus(false)
        setBills(updatedBills)
        setEditBillId(null)
        setEditBillAmount('')
        setEditBillDate('')
        setEditBillDescription('')
        setSelectedPerson('')
      } catch (error) {
        console.error(error)
      }
    }
  }

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'persons'))
      const data: Person[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setPersons(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Adicionar Contas Recebidas</h1>
            <form onSubmit={addBill}>
              <input
                type="text"
                placeholder="Valor..."
                value={inputBillAmount}
                onChange={handleBillAmountChange}
              />
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={inputBillDate}
                onChange={handleBillDateChange}
              />
              <input
                type="text"
                placeholder="Descrição..."
                value={inputBillDescription}
                onChange={handleBillDescriptionChange}
              />
              <select value={selectedPerson} onChange={handlePersonChange}>
                <option value="">Selecione uma pessoa</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              <button className={styles.button} type="submit">
                Adicionar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.paymentContainer}>
          <h1>Contas Recebidas</h1>
          <ul>
            {bills.map((bill) => (
              <li key={bill.id} className={styles.payment}>
                {editBillId === bill.id ? (
                  <div>
                    <input
                      type="text"
                      value={editBillAmount}
                      onChange={(e) => setEditBillAmount(e.target.value)}
                    />
                    <input
                      type="text"
                      value={editBillDate}
                      onChange={(e) => setEditBillDate(e.target.value)}
                    />
                    <input
                      type="text"
                      value={editBillDescription}
                      onChange={(e) => setEditBillDescription(e.target.value)}
                    />
                    <select
                      value={selectedPerson}
                      onChange={handlePersonChange}
                    ></select>
                  </div>
                ) : (
                  <div className={styles.payment}>
                    <article>
                      <span>Valor: </span> {bill.amount}
                    </article>
                    <article>
                      <span>Data: </span>
                      {bill.date}
                    </article>
                    <article>
                      <span>Descrição: </span>
                      {bill.description}
                    </article>
                    <article>
                      <span>Cliente: </span>
                      {persons.find((person) => person.id === bill.personId)?.name}
                    </article>
                  </div>
                )}
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => editBill(
                    bill.id, 
                    bill.amount, 
                    bill.date, 
                    bill.description,
                    bill.personId,
                    )}
                >
                  Editar
                </button>
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => deleteBill(bill.id)}
                >
                  Deletar
                </button>
                <br />
                _________________________________
              </li>
            ))}
          </ul>

          {editBillId && (
            <div>
              <button className={styles.button} onClick={updateBill}>
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