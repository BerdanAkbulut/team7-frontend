import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import { Suspense } from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
