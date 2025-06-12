import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

import SectionOne from '../SectionOne/SectionOne';
import SectionTwo from '../SectionTwo/SectionTwo';
import SectionThree from '../SectionThree/SectionThree';
import SectionFour from '../SectionFour/SectionFour';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState({
    sectionOne: false,
    sectionTwo: false,
    sectionThree: false,
    sectionFour: false
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        // Pré-carregar as seções
        const loadSection = async (sectionName) => {
          try {
            switch (sectionName) {
              case 'sectionOne':
                await import('../SectionOne/SectionOne');
                break;
              case 'sectionTwo':
                await import('../SectionTwo/SectionTwo');
                break;
              case 'sectionThree':
                await import('../SectionThree/SectionThree');
                break;
              case 'sectionFour':
                await import('../SectionFour/SectionFour');
                break;
              default:
                throw new Error(`Seção ${sectionName} não encontrada`);
            }
            return true;
          } catch (err) {
            console.error(`Erro ao carregar ${sectionName}:`, err);
            return false;
          }
        };

        // Carregar todas as seções em paralelo
        const sectionPromises = Object.keys(sections).map(sectionName => 
          loadSection(sectionName)
        );

        const results = await Promise.all(sectionPromises);
        
        // Atualizar o estado das seções com base nos resultados
        const newSections = {};
        Object.keys(sections).forEach((sectionName, index) => {
          newSections[sectionName] = results[index];
        });

        setSections(newSections);
        setIsLoaded(true);
      } catch (error) {
        console.error('Erro ao inicializar Home:', error);
        setError('Erro ao carregar a página inicial. Por favor, tente novamente.');
      }
    };

    loadSections();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      const scrollToSection = (sectionId) => {
        if (!sectionId) return;
        
        const element = document.getElementById(sectionId);
        if (!element) {
          console.warn(`Seção ${sectionId} não encontrada`);
          return;
        }

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
      setError('Erro ao navegar entre as seções. Por favor, tente novamente.');
    }
  }, [location.state, location.hash, isLoaded]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Ops! Algo deu errado</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Verifica se todas as seções foram carregadas com sucesso
  const allSectionsLoaded = Object.values(sections).every(section => section === true);

  if (!allSectionsLoaded) {
    return (
      <div className="error-container">
        <h2>Atenção</h2>
        <p className="error-message">
          Algumas seções da página não puderam ser carregadas completamente.
          Por favor, tente recarregar a página.
        </p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Recarregar Página
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {sections.sectionOne && <SectionOne />}
      <div id="sectionTwo">
        {sections.sectionTwo && <SectionTwo />}
      </div>
      <div id="sectionThree">
        {sections.sectionThree && <SectionThree />}
      </div>
      <div id="sectionFour">
        {sections.sectionFour && <SectionFour />}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
