import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore'
import styles from './styles.module.css'
import { db } from '../../services/firebaseConnection'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

type Product = {
  id: string
  name: string
  quantity: number
};

export default function InventoryControl() {
  const [products, setProducts] = useState<Product[]>([])
  const [inputName, setInputName] = useState('')
  const [inputQuantity, setInputQuantity] = useState('')
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState('')
  const [editProductQuantity, setEditProductQuantity] = useState('')
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts: Product[] = []
      snapshot.forEach((doc) => {
        const productData = doc.data()
        const product: Product = {
          id: doc.id,
          name: productData.name,
          quantity: productData.quantity,
        };
        fetchedProducts.push(product)
      });
      setProducts(fetchedProducts)
    });

    return () => {
      unsubscribe()
    }
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value)
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputQuantity(event.target.value)
  };

  const addProduct = async (event: FormEvent) => {
    event.preventDefault()

    if (inputName.trim() !== '' && inputQuantity.trim() !== '') {
      const newProduct: Product = {
        id: '',
        name: inputName.trim(),
        quantity: parseInt(inputQuantity.trim(), 10),
      }

      try {
        const docRef = await addDoc(collection(db, 'products'), newProduct)
        newProduct.id = docRef.id
        setProducts([...products, newProduct])
        setInputName('')
        setInputQuantity('')
      } catch (error) {
        console.error('Error adding product to Firestore: ', error)
      }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId))
      const updatedProducts = products.filter((product) => product.id !== productId)
      setProducts(updatedProducts)
    } catch (error) {
      console.error('Error deleting product from Firestore: ', error)
    }
  }

  const editProduct = (productId: string, productName: string, productQuantity: number) => {
    setStatus(true)
    setEditProductId(productId)
    setEditProductName(productName)
    setEditProductQuantity(productQuantity.toString())
  }

  const cancelEdit = () => {
    setStatus(false)
    setEditProductId(null)
  }

  const updateProduct = async () => {
    if (editProductId && editProductName.trim() !== '' && editProductQuantity.trim() !== '') {
      try {
        const productRef = doc(db, 'products', editProductId);
        await updateDoc(productRef, {
          name: editProductName.trim(),
          quantity: parseInt(editProductQuantity.trim(), 10),
        })
        const updatedProducts = products.map((product) => {
          if (product.id === editProductId) {
            product.name = editProductName.trim()
            product.quantity = parseInt(editProductQuantity.trim(), 10)
          }
          return product
        })
        setStatus(false)
        setProducts(updatedProducts)
        setEditProductId(null)
        setEditProductName('')
        setEditProductQuantity('')
      } catch (error) {
        console.error('Error updating product in Firestore: ', error)
      }
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Controle de Estoque</h1>
            <form onSubmit={addProduct}>
              <input type="text" placeholder="Produto" value={inputName} onChange={handleNameChange} />
              <input
                type="text"
                placeholder="Quantidade"
                value={inputQuantity}
                onChange={handleQuantityChange}
              />
              <button className={styles.button} type="submit">
                Adicionar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.productContainer}>
          <h1>Produtos em Estoque</h1>
          <ul>
            {products.map((product) => (
              <li key={product.id} className={styles.product}>
                {editProductId === product.id ? (
                  <div>
                    <input
                      type="text"
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                    />
                    <input
                      type="text"
                      value={editProductQuantity}
                      onChange={(e) => setEditProductQuantity(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className={styles.product}>
                    <article>
                      <span>Produto: </span> {product.name}
                    </article>
                    <article>
                      <span>Quantidade: </span> {product.quantity}
                    </article>
                  </div>
                )}
                <button
                  hidden={status}
                  className={styles.button}
                  onClick={() => editProduct(product.id, product.name, product.quantity)}
                >
                  Editar
                </button>
                <button hidden={status} className={styles.button} onClick={() => deleteProduct(product.id)}>
                  Deletar
                </button>
                <br />
                _________________________________
              </li>
            ))}
          </ul>

          {editProductId && (
            <div>
              <button className={styles.button} onClick={updateProduct}>
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
  const session = await getSession({ req })

  if (!session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  }
}