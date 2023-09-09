import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
        <p>
            This website is a work in progress at the moment.
        </p>
        <p>
            I decided to migrate my previous site <a href="https://jer-k.github.io" target="_blank">jer-k.github.io</a>, from Gatbsy to Next.js (with App router) and move the site from Github to Vercel.
        </p>
    </main>
  )
}
