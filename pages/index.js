import ChatRoom from '../components/ChatRoom';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { Fade } from 'react-awesome-reveal';
export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>TEAM 7 | HOMEPAGE</title>
        <link
          rel="shortcut icon"
          href="https://i.pinimg.com/originals/ae/cd/3e/aecd3efe2cb83779f2fa074e6c8b1fb3.jpg"
        />
      </Head>

      <h1 className={`${styles.title} animate-pulse`}>Welcome , please pick one.</h1>

      <Fade>
        <div className="flex gap-[200px]">
          <button
            onClick={() => router.push('/host')}
            className={styles.button}
          >
            I`m Host
          </button>

          <button
            onClick={() => router.push('/user')}
            className={styles.button2}
          >
            I`m User
          </button>
        </div>
      </Fade>
    </div>
  );
}
