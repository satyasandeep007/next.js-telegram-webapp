import '../styles/globals.css';
import axios from 'axios';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Roboto, Roboto_Mono } from 'next/font/google';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isHashValid, setIsHashValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateHash = async () => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const response = await axios.post('/api/validate-hash', { 
            hash: window.Telegram.WebApp.initData 
          });
          setIsHashValid(response.status === 200);
        } else {
          console.error('Telegram WebApp is not available');
          setIsHashValid(false);
        }
      } catch (error) {
        console.error('Error validating hash:', error);
        setIsHashValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateHash();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  if (!isHashValid) {
    return <div>Invalid hash. Access denied.</div>; // Or a more user-friendly error message
  }

  return (
    <main className={`${roboto.variable} ${robotoMono.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
