import Head from 'next/head'
import { redirect } from 'next/dist/server/api-utils'
import {getSession} from 'next-auth/react'
import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import Link from 'next/link'

import styles from './styles.module.css'

export default function Dashboard (){
    return(
        <div className={styles.container}>
            <Head>
                <title>OVO | Contas à Receber</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.resumo}>
                    <h1>Contas à Receber</h1>
                    
                </section>
            </main>
        </div>
    )
}