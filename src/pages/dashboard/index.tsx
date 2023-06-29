import Head from 'next/head'
import { redirect } from 'next/dist/server/api-utils'
import {getSession} from 'next-auth/react'
import React from 'react'
import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import {PagarSoma} from '../../components/pagarsoma'
import {ReceberSoma} from '../../components/recebersoma'
import {Saldo} from '../../components/saldo'

export default function Dashboard (){

   

    return(
        <div className={styles.container}>
            <Head>
                <title>OVO | Dashboard</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.resumo}>
                    <h1>Dashboard</h1>
                    <ReceberSoma/>
                    <PagarSoma/>
                    <Saldo/>
                </section>
            </main>
        </div>
    )
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