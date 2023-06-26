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
                <title>OVO | Dashboard</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.resumo}>
                    <h1>Dashboard</h1>
                    <article>
                        <p>contas a pagar dia - valor</p>
                    </article>
                    <article>
                        <p>contas a receber dia - valor</p>
                    </article>
                    <article>
                        <p>contas em atraso - valor</p>
                    </article>
                </section>
            </main>
        </div>
    )
}