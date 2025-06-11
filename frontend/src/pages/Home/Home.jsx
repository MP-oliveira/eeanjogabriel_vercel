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
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Marca como carregado após um pequeno delay
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Erro ao inicializar Home:', error);
      setError('Erro ao carregar a página inicial');
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      const scrollToSection = (sectionId) => {
        if (!sectionId) return;
        
        const element = document.getElementById(sectionId);
        if (!element) return;

        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
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
    } catch (error) {
      console.error('Erro ao rolar para seção:', error);
    }
  }, [location.state, location.hash, isLoaded]);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
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
