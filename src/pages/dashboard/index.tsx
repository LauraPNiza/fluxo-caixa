import Head from 'next/head'
import { redirect } from 'next/dist/server/api-utils'
import {getSession} from 'next-auth/react'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

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