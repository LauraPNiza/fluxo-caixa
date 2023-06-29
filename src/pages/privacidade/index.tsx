import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from './styles.module.css'
import Image from 'next/image'

export default function Privacidade() {
  return (
    <div className={styles.container}>
      <Head>
        <title>oVo | Fluxo de caixa</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Privacidade
        </h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia inventore eligendi dolorum excepturi recusandae nemo magnam sed ipsum debitis doloribus, nam, corporis architecto! Voluptatum quisquam veniam fugit, tenetur fugiat et.</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam eligendi adipisci magni quas facere. Rerum, tempora inventore ea molestias vero sunt. Veritatis, a asperiores consequuntur consequatur in cumque dolor minima?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus accusantium odit rerum optio, officiis obcaecati perspiciatis et reprehenderit praesentium sequi expedita nemo quas inventore rem ut at iure, dicta ipsa?</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita commodi vel cupiditate voluptate iste, sequi, omnis fugit eveniet inventore assumenda recusandae quibusdam nemo nihil repudiandae vero quaerat molestiae, minus odit?</p>
        
      </main>
    </div>
  )
}