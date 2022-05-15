import Head from 'next/head'
import { signOut } from 'next-auth/react'

import { Header } from '../components/Header'

export default function Home() {
  return (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <button onClick={signOut}>
        Sign Out
      </button>
    </div>
  )
}
