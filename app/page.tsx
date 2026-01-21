import Image from 'next/image';
import Link from 'next/link';
import EmailLink from '@/components/EmailLink';

export default function Home() {
  return (
    <>
      <header>
        <h1>Dale Wiggins</h1>
        <p><EmailLink /></p>
      </header>
      <section className="bio">
        <p>Full stack web/web3 developer | 🏐 🎾 ⚾ player | On enlightenment path<br />
          helping others focus on what matters
          | Offering insights and reflections</p>
        <p>
          <Link href="/now">What I&apos;m doing nowawdays</Link>
        </p>
      </section>
      <hr />
      <section className="social">
        <a href="https://twitter.com/dalew" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/twitter.ico" alt="Twitter Logo" width={32} height={32} />
        </a>
        <a href="https://www.linkedin.com/in/dalewiggins/" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/linkedin.png" alt="LinkedIn Logo" width={32} height={32} />
        </a>
        <a href="https://dalew75.substack.com/" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/substack.ico" alt="Substack Logo" width={32} height={32} />
        </a>
        <a href="https://www.instagram.com/dalew75/" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/instagram.png" alt="Instagram Logo" width={32} height={32} />
        </a>
        <a href="https://github.com/dalew75" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/github.ico" alt="GitHub Logo" width={32} height={32} />
        </a>
        <a href="https://www.facebook.com/dalewig" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/facebook.png" alt="Facebook Logo" width={32} height={32} />
        </a>
      </section>
      <section className="social">
        <span>Support my work: </span>
        <a href="https://www.buymeacoffee.com/dalew" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/buymeacoffee.ico" alt="Buy Me a Coffee Logo" width={32} height={32} />
        </a>
        <a href="https://www.paypal.com/paypalme/dalew75" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/paypal.ico" alt="PayPal Logo" width={32} height={32} />
        </a>
      </section>
    </>
  );
}
