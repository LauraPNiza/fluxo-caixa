import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ovo from '../../public/ovoReduzido.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>oVo | Fluxo de caixa</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image src={ovo} alt={'Logo Ovo Caramuru'}></Image>
        </div>
        <h1 className={styles.title}>
          Sistema de fluxo de caixa e controle de estoque
        </h1>
        
      </main>
    </div>
  )
}