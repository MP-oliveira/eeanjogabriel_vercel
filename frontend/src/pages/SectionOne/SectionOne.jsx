import { useState, useEffect } from 'react';
import './SectionOne.css'
import Formatura from '../../assets/formatura.jpg'

const SectionOne = () => {
  const [imageState, setImageState] = useState({
    isLoading: true,
    hasError: false,
    isLoaded: false
  });

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const img = new Image();
        
        img.onload = () => {
          if (isMounted) {
            setImageState({
              isLoading: false,
              hasError: false,
              isLoaded: true
            });
          }
        };

        img.onerror = () => {
          if (isMounted) {
            console.error('Erro ao carregar imagem de formatura');
            setImageState({
              isLoading: false,
              hasError: true,
              isLoaded: false
            });
          }
        };

        img.src = Formatura;
      } catch (error) {
        if (isMounted) {
          console.error('Erro ao inicializar carregamento da imagem:', error);
          setImageState({
            isLoading: false,
            hasError: true,
            isLoaded: false
          });
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSectionTwo = () => {
    try {
      const sectionTwo = document.getElementById('sectionTwo');
      if (!sectionTwo) {
        console.error('Seção Two não encontrada');
        return;
      }
      sectionTwo.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao rolar para seção:', error);
    }
  };

  const renderImage = () => {
    if (imageState.isLoading) {
      return (
        <div className="image-loading">
          <p>Carregando imagem...</p>
        </div>
      );
    }

    if (imageState.hasError) {
      return (
        <div className="image-error">
          <p>Imagem temporariamente indisponível</p>
        </div>
      );
    }

    return (
      <img 
        className="sectionOne-img" 
        src={Formatura} 
        alt="Formatura" 
        onError={() => setImageState(prev => ({ ...prev, hasError: true, isLoaded: false }))}
      />
    );
  };

  return (
    <section id="sectionOne" className="sectionOne-content">
      <div className="sectionOne-container">
        <div className="sectionOne-left">
          <h1 className="sectionOne-h1">Sua escola de enfermagem de confiança em Simões Filho</h1>
          <p className="sectionOne-p">Com mais de 25 anos de experiência, construímos uma reputação sólida na formação de profissionais de enfermagem qualificados, oferecendo cursos técnicos adaptados às suas necessidades.</p>
          <div className="sectionOne-cta">
            <button className="sectionOne-btn" onClick={scrollToSectionTwo}>
              Explore nossos cursos
            </button>
            <div className="rating-box">
              <div className="stars">★ ★ ★ ★ ★</div>
              <span>Mais de 4000+ alunos</span>
            </div>
          </div>
          <div className="features">
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Aulas de segunda a sábado
            </div>
            <div className="feature-item">
              <span className="check-icon">✓</span>
              Professores certificados e Qualificados
            </div>
          </div>
        </div>
        <div className="sectionOne-right">
          {renderImage()}
        </div>
      </div>
    </section>
  );
};

export default SectionOne;