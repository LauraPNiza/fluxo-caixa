import styles from './styles.module.css'
import Link from 'next/link'
import {useSession, signIn, signOut} from 'next-auth/react'

export function Header(){

    const {data: session, status } = useSession()

    return(
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.linkLogo}>
                        <h1 className={styles.logo}>
                            oVo <span>ERP</span>
                        </h1>
                    </Link>
                    {session?.user && (
                        <Link href="/dashboard" className={styles.link}>
                        Meu Painel
                    </Link>
                    )}

                    {session?.user && (
                        <Link href="/cadastros" className={styles.link}>
                        Cadastros
                    </Link>
                    )}

                    {session?.user && (
                        <Link href="/receber" className={styles.link}>
                        Contas à Receber
                    </Link>
                    )}
                    
                    {session?.user && (
                        <Link href="/pagar" className={styles.link}>
                        Contas à Pagar
                    </Link>
                    )}

                    {session?.user && (
                        <Link href="/estoque" className={styles.link}>
                        Estoque
                    </Link>
                    )}
                </nav>

                {status === "loading" ? (
                    <></>
                ): session ? (
                    <button className={styles.loginButton} onClick={()=> signOut()}>Olá, {session?.user?.name}</button>
                ) : (
                    <button className={styles.loginButton} onClick={()=> signIn("google")}>Acessar</button>
                )}

                
            </section>
        </header>
    )
}