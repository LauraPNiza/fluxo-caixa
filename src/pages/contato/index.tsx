import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from './styles.module.css'
import Image from 'next/image'

export default function Contato() {
  return (
    <div className={styles.container}>
      <Head>
        <title>oVo | Fluxo de caixa</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Contato desenvolvedores
        </h1>
        <ul>
            <li>Laura Niza</li>
            <li>laurapegininiza18@gmail.com</li>
            <li>Estudante de Engenharia de Software</li>
        </ul>
        
      </main>
    </div>
  )
}