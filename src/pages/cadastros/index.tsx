import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import styles from './styles.module.css';
import { db } from '../../services/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

type Person = {
  id: string
  name: string
  address: string
};

export default function Cadastro() {
  const [persons, setPersons] = useState<Person[]>([])
  const [inputName, setInputName] = useState('')
  const [inputAddress, setInputAddress] = useState('')
  const [editPersonId, setEditPersonId] = useState<string | null>(null)
  const [editPersonName, setEditPersonName] = useState('')
  const [editPersonAddress, setEditPersonAddress] = useState('')
  const [status, setStatus] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'persons'), (snapshot) => {
      const fetchedPersons: Person[] = []
      snapshot.forEach((doc) => {
        const personData = doc.data()
        const person: Person = {
          id: doc.id,
          name: personData.name,
          address: personData.address,
        };
        fetchedPersons.push(person)
      });
      setPersons(fetchedPersons)
    });

    return () => {
      unsubscribe()
    }
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value)
  }

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value)
  }

  const addPerson = async (event: FormEvent) => {
    event.preventDefault()

    if (inputName.trim() !== '' && inputAddress.trim() !== '') {
      const newPerson: Person = {
        id: '',
        name: inputName.trim(),
        address: inputAddress.trim(),
      };

      try {
        const docRef = await addDoc(collection(db, 'persons'), newPerson)
        newPerson.id = docRef.id
        setPersons([...persons, newPerson]);
        setInputName('')
        setInputAddress('')
      } catch (error) {
        console.error('Error adding person to Firestore: ', error)
      }
    }
  };

  const deletePerson = async (personId: string) => {
    try {
      await deleteDoc(doc(db, 'persons', personId))
      const updatedPersons = persons.filter((person) => person.id !== personId)
      setPersons(updatedPersons)
    } catch (error) {
      console.error('Error deleting person from Firestore: ', error)
    }
  };

  const editPerson = (personId: string, personName: string, personAddress: string) => {
    setStatus(true)
    setEditPersonId(personId)
    setEditPersonName(personName)
    setEditPersonAddress(personAddress)
  };

  const cancelEdit = () => {
    setStatus(false)
    setEditPersonId(null)
  };

  const updatePerson = async () => {
    if (editPersonId && editPersonName.trim() !== '' && editPersonAddress.trim() !== '') {
      try {
        const personRef = doc(db, 'persons', editPersonId)
        await updateDoc(personRef, {
          name: editPersonName.trim(),
          address: editPersonAddress.trim(),
        })
        const updatedPersons = persons.map((person) => {
          if (person.id === editPersonId) {
            person.name = editPersonName.trim()
            person.address = editPersonAddress.trim()
          }
          return person
        })
        setStatus(false);
        setPersons(updatedPersons)
        setEditPersonId(null)
        setEditPersonName('')
        setEditPersonAddress('')
      } catch (error) {
        console.error('Error updating person in Firestore: ', error)
      }
    }
  }

  return (
    <div className={styles.container}>
        <main className={styles.main}>
            <section className={styles.content}>
                <div className={styles.contentForm}>
                    <h1 className={styles.title}>Cadastrar</h1>
                    <form onSubmit={addPerson}>
                        <input
                          type="text"
                          placeholder="Insira nome..."
                          value={inputName}
                          onChange={handleNameChange}
                        />
                        <input
                          type="text"
                          placeholder="Insira endereço..."
                          value={inputAddress}
                          onChange={handleAddressChange}
                        />
                        <button 
                          className={styles.button}
                          type='submit'
                        >
                          Adicionar
                        </button>
                    </form>
                </div>
            </section>

            <section className={styles.personContainer}>
              <h1>Gerenciar Cadastros</h1>
              <ul>
                {persons.map((person) => (
                  <li key={person.id} className={styles.person}>
                    {editPersonId === person.id ? (
                      <div>
                        <input
                          type="text"
                          value={editPersonName}
                          onChange={(e) => setEditPersonName(e.target.value)}
                        />
                        <input
                          type="text"
                          value={editPersonAddress}
                          onChange={(e) => setEditPersonAddress(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className={styles.person}>
                        <article>
                          <span>Name:</span> {person.name}
                        </article>
                        <article>
                          <span>Address:</span>
                          {person.address}
                        </article>
                      </div>
                    )}
                    <button
                      hidden={status}
                      className={styles.button}
                      onClick={() => editPerson(person.id, person.name, person.address)}
                    >
                      Editar
                    </button>
                    <button 
                      hidden={status}
                      className={styles.button}
                      onClick={() => deletePerson(person.id)}
                    >
                      Deletetar
                    </button>
                    <br/>
                    _________________________________
                  </li>
                ))}
              </ul>
            
              {editPersonId && (
                  <div>
                  <button
                    className={styles.button} 
                    onClick={updatePerson}
                  >
                    Atualizar
                  </button>
                  <button 
                    className={styles.button}
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                  </div>
              )}
            </section>
        </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps =async ({req}) => {
  const session = await getSession({req})

  if(!session?.user){
        return{
            redirect:{
                destination: "/",
                permanent: false,
            },
        }
    }

    return{
        props: {
            user: {
                email: session?.user?.email,
            }
        },
    }
}