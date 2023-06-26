import React, { useState } from 'react';
import styles from './styles.module.css';

type Person = {
  id: number;
  name: string;
  address: string;
};

export default function Cadastro(){
  const [persons, setPersons] = useState<Person[]>([]);
  const [inputName, setInputName] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [editPersonId, setEditPersonId] = useState<number | null>(null);
  const [editPersonName, setEditPersonName] = useState('');
  const [editPersonAddress, setEditPersonAddress] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(e.target.value);
  };

  const addPerson = () => {
    if (inputName.trim() !== '' && inputAddress.trim() !== '') {
      const newPerson: Person = {
        id: new Date().getTime(),
        name: inputName.trim(),
        address: inputAddress.trim()
      };
      setPersons([...persons, newPerson]);
      setInputName('');
      setInputAddress('');
    }
  };

  const deletePerson = (personId: number) => {
    const updatedPersons = persons.filter(person => person.id !== personId);
    setPersons(updatedPersons);
  };

  const editPerson = (personId: number, personName: string, personAddress: string) => {
    setEditPersonId(personId);
    setEditPersonName(personName);
    setEditPersonAddress(personAddress);
  };

  const updatePerson = () => {
    if (editPersonId && editPersonName.trim() !== '' && editPersonAddress.trim() !== '') {
      const updatedPersons = persons.map(person => {
        if (person.id === editPersonId) {
          person.name = editPersonName.trim();
          person.address = editPersonAddress.trim();
        }
        return person;
      });
      setPersons(updatedPersons);
      setEditPersonId(null);
      setEditPersonName('');
      setEditPersonAddress('');
    }
  };

  return (
    <div className={styles.container}>
        <main className={styles.main}>
            <section className={styles.content}>
                <div className={styles.contentForm}>
                    <h1 className={styles.title}>Cadastros</h1>
                    <form >
                        <input
                        type="text"
                        placeholder="Insira nome..."
                        value={inputName}
                        onChange={handleNameChange}
                        />
                        <input
                        type="text"
                        placeholder="Insira endereço"
                        value={inputAddress}
                        onChange={handleAddressChange}
                        />
                        <button onClick={addPerson}>Adicionar</button>
                    </form>
                </div>
            </section>
            <ul>
                {persons.map(person => (
                <li key={person.id}>
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
                    <div>
                        <strong>Name:</strong> {person.name}<br />
                        <strong>Address:</strong> {person.address}
                    </div>
                    )}
                    <button onClick={() => editPerson(person.id, person.name, person.address)}>Edit</button>
                    <button onClick={() => deletePerson(person.id)}>Delete</button>
                </li>
                ))}
            </ul>
            {editPersonId && (
                <div>
                <button onClick={updatePerson}>Update Person</button>
                <button onClick={() => setEditPersonId(null)}>Cancel</button>
                </div>
            )}
        </main>
    </div>
  );
};