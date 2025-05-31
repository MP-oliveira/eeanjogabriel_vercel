import { FaWhatsapp } from 'react-icons/fa';
import './Footer.css';
import footer1 from '../../assets/footer1.png';
import footer2 from '../../assets/footer2.png';
import footer3 from '../../assets/footer3.png';
import footer4 from '../../assets/footer4.png';
import footer5 from '../../assets/footer5.png';
import footer6 from '../../assets/footer6.png';

const Footer = () => {
  const whatsappLink = () => {
    const number = "5571992011531";
    const message = "Olá! Gostaria de saber mais informações sobre os cursos.";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const handleScroll = (sectionId) => {
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

  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-cta">Precisa de informações?</h2>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="footer-button">
          <FaWhatsapp /> (71) 99201-1531
        </a>
      </div>

      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-header">
            <h3> Escola de Enfermagem <span>Anjo Gabriel</span></h3>
          </div>
          <p>Formação técnica de excelência em enfermagem</p>
        </div>

        <div className="footer-locations">
          <div className="location">
            <h4>Simões Filho</h4>
            <p>Avenida Altamirando de Araújo Ramos, 278</p>
            <p>Centro, Simões Filho - BA</p>
            <a href="#" className="location-link">Ver no Google Maps</a>
          </div>
        </div>

        <div className="footer-gallery">
          <img src={footer1} alt="Laboratório" />
          <img src={footer2} alt="Sala de Aula" />
          <img src={footer3} alt="Prática" />
          <img src={footer4} alt="Formatura" />
          <img src={footer5} alt="Estrutura" />
          <img src={footer6} alt="Equipamentos" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 - Escola Técnica de Enfermagem <span> Anjo Gabriel</span></p>
        <nav>
          <button onClick={() => handleScroll("sectionOne")}>Home</button>
          <button onClick={() => handleScroll("sectionTwo")}>Nossos Cursos</button>
          <button onClick={() => handleScroll("sectionThree")}>Nossa Estrutura</button>
          <button onClick={() => handleScroll("sectionFour")}>Fale Conosco</button>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 