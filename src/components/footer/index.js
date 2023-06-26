import styles from './styles.module.css'
import Link from 'next/link'

export function Footer(){

    return(
        <footer className={styles.footer}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href="/termosUso" className={styles.link}>
                        <span>Termos de Uso</span>
                    </Link>

                    <Link href="/privacidade" className={styles.link}>
                        <span>Privacidade</span>
                    </Link>

                    <Link href="/contato" className={styles.link}>
                        <span>Contato</span>
                    </Link>
                </nav>
                
            </section>
        </footer>
    )
}