import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import SectionOne from '../SectionOne/SectionOne';
import SectionTwo from '../SectionTwo/SectionTwo';
import SectionThree from '../SectionThree/SectionThree';
import SectionFour from '../SectionFour/SectionFour';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Marca como carregado após um pequeno delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // Verifica se há um hash na URL (ex: #sectionTwo)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      scrollToSection(hash);
    }
    // Verifica se há um estado de scroll
    else if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location.state, location.hash, isLoaded]);

  return (
    <div>
      <SectionOne />
      <div id="sectionTwo">
        <SectionTwo />
      </div>
      <div id="sectionThree">
        <SectionThree />
      </div>
      <div id="sectionFour">
        <SectionFour />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
