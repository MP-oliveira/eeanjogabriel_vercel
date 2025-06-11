import { useState, useEffect } from 'react';
import './SectionOne.css'
import Formatura from '../../assets/formatura.jpg'

const SectionOne = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pré-carregar a imagem
    const img = new Image();
    img.src = Formatura;
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => {
      console.error('Erro ao carregar imagem de formatura');
      setError('Erro ao carregar imagem');
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

  if (error) {
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
            <div className="image-error">
              <p>Imagem temporariamente indisponível</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {!isImageLoaded ? (
            <div className="image-loading">
              <p>Carregando imagem...</p>
            </div>
          ) : (
            <img 
              className="sectionOne-img" 
              src={Formatura} 
              alt="Formatura" 
              onError={() => setError('Erro ao carregar imagem')}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default SectionOne