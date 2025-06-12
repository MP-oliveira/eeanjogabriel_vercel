import { useEffect, useState } from 'react';
import './LoadingScreen.css';
import Logo from '../../assets/Logo.png';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <img src={Logo} alt="Escola de Enfermagem Anjo Gabriel" />
        </div>
        <div className="loading-text">
          <h2>Carregando{dots}</h2>
          <p>Por favor, aguarde enquanto preparamos tudo para você</p>
        </div>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 