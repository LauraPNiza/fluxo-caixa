import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Header} from '../components/header'
import {SessionProvider} from 'next-auth/react'
import {Footer} from '../components/footer'

export default function App({ Component, pageProps }: AppProps) {

  const register = async () => {}

  const login = async () => {}

  const logout = async () => {}

  return (
    <SessionProvider session={pageProps.session}>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </SessionProvider>
  )
}
