import Hero from '../components/Hero';
import About from '../components/About';
import Books from '../components/Books';
import Contact from '../components/Contact';

export default function Home({ user }) {
  return (
    <>
      <Hero user={user} />
      <About />
      <Books user={user} />
      <Contact />
    </>
  );
}