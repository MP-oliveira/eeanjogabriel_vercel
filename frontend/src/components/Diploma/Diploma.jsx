import './Diploma.css';
import LogoAnjo from '../../assets/logoAnjo.png';
import LogoAnjo2 from '../../assets/logoAnjo2.png';
import LogoBandeira from '../../assets/bandeira.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import FundoDiploma from './FundoDiploma';
import VoltarButton from '../VoltarButton/VoltarButton';


const Diploma = () => {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  // Função para formatar a data de nascimento
  const formatarData = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return dataString; // Se não for uma data válida, retorna a string original
    
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    if (!id) {
      setError('ID do aluno não encontrado na URL.');
      setLoading(false);
      return;
    }

    const fetchAluno = async () => {
      try {
        const response = await api.get(`/alunos/${id}`);
        if (!response.data) {
          throw new Error('Nenhum dado retornado pela API.');
        }
        setAluno(response.data);
        console.log('aluno response', response.data)
      } catch (error) {
        console.error('Erro ao buscar aluno no diploma:', error);
        setError('Erro ao carregar os dados do aluno. Verifique a API.');
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [id]);
  const handlePrint = () => {
    // Create a style element for print settings
    const style = document.createElement('style');
    style.innerHTML = `
      @page {
        size: landscape;
        margin: 0;
      }
      
      @media print {
        body, html {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        .diploma_container, .print-page {
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
          page-break-after: always;
          box-sizing: border-box;
        }
        
        .diploma_impressao {
          transform: rotate(0deg);
          max-width: 100%;
          max-height: 100%;
        }
      }
    `;
    style.id = 'print-orientation';
    
    // Add style to head temporarily
    document.head.appendChild(style);
    
    // Print
    window.print();
    
    // Remove style after printing
    setTimeout(() => {
      const element = document.getElementById('print-orientation');
      if (element) {
        element.remove();
      }
    }, 1000);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="diploma-wrapper">
      <div className='print-btn no-print'>
        <button onClick={handlePrint} className="aluno-btn">
          Imprimir Diploma
        </button>

      </div>
      {/* Frente do Diploma */}
      <div className='diploma_container print-page'>
        <div className="diploma_impressao">
          <div className='diploma_borda'>
            <div className='no-print'>
              <VoltarButton url='/alunos' />
            </div>
            <div className="diploma_headers">
              <div className="logo_anjo">
                <img className="bandeira" src={LogoBandeira} alt="Bandeira" />
                <div className='logo_anjo_text'>
                  <h1>REPÚBLICA FEDERATIVA DO BRASIL</h1>
                  <h2>Escola de Enfermagem Anjo Gabriel Ltda.</h2>
                </div>
                <img src={LogoAnjo} alt="Logo Anjo" />
              </div>
              <p>Av. Altamirando de Araújo Ramos, 278 - 1º andar - Centro - Simões Filho - Bahia <br/>
                ENTIDADE MANTENEDORA: SOCIEDADE CIVIL ESCOLA DE AUXILIAR DE ENFERMAGEM ANJO GABRIEL LTDA.
                <br/>PARECER CEE- Nº 196/2025, RESOLUÇÃO CEE- Nº 148/2025, D.O. DE 16/06/2025
                CNPJ 02.422.402/0001-00
              </p>
              {/* Marca d'água */}
              <img src={LogoAnjo} alt="Marca d'água" className="marca-dagua" />
              <h3>DIPLOMA</h3>
            </div>
            <img className='anjo2' src={LogoAnjo2} alt="Logo Anjo 2" />
            <div className="diploma_content">
              {aluno ? (
                <p>A DIRETORA da Escola de Enfermagem Anjo Gabriel, de acordo com a Lei 9394/96,
                  confere o título de <strong>Técnico de Enfermagem</strong> a <strong>{aluno.nome}</strong>, CPF nº. <strong>{aluno.cpf}</strong>,
                  filho(a) de {aluno.pai ? <><strong>{aluno.pai}</strong> e de <strong>{aluno.mae}</strong></> : <strong>{aluno.mae}</strong>}, natural de <strong>{aluno.naturalidade}</strong>,
                  nascido(a) em <strong>{formatarData(aluno.data_nascimento)}</strong>, nacionalidade <strong>{aluno.nacionalidade}</strong>,
                  por haver concluído o Curso de <strong>Educação Profissional Técnica de Nível Médio em Enfermagem </strong>
                  no eixo tecnológico ambiente e saúde no ano de 2023.
                  O presente Diploma outorga-lhe os direitos e prerrogativas estabelecidas nas Leis Vigentes do País.
                </p>
              ) : (
                <p>Dados do aluno não disponíveis.</p>
              )}
            </div>
            <div className="assinaturas-frente">
              <div className="diploma_assinatura_top-frente">
                <p>Simões Filho / Ba, ___________________</p>
              </div>
              <div className="assinaturas_bottom-frente">
                <div>
                  <div className='assinaturas_line-frente'></div>
                  <p>Concluinte</p>
                </div>
                <div>
                  <div className='assinaturas_line-frente'></div>
                  <p>Secretário (a)</p>
                </div>
                <div>
                  <div className='assinaturas_line-frente'></div>
                  <p>Diretor(a)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Verso do Diploma */}
      <div className="print-page">
        <FundoDiploma />
      </div>
    </div>
  );
};

export default Diploma;