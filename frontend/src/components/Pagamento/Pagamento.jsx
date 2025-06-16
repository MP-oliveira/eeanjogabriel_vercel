import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import './Pagamento.css';
import { useParams, useNavigate } from 'react-router-dom';
import VoltarButton from '../VoltarButton/VoltarButton';
import { UserContext } from '../../context/UseContext';

const Pagamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [aluno, setAluno] = useState(null);
  const [contas, setContas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    conta_id: '',
    mes_referencia: '',
    valor: '',
    recebido_por: '',
    observacao: ''
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userLog = localStorage.getItem("user");

        console.log('Dados do localStorage:', { token, userLog });

        if (userLog) {
          try {
            const parsedUser = JSON.parse(userLog);
            // Pega os dados do campo 'user' do objeto salvo
            const nome = parsedUser.user?.nome || '';
            const id = parsedUser.user?.id || null;
            const email = parsedUser.user?.email || '';
            const role = parsedUser.user?.role || '';

            const userData = { role, nome, email, id };
            console.log('Dados do usuário a serem definidos:', userData);
            setUser(userData);
          } catch (parseError) {
            console.error('Erro ao fazer parse dos dados do usuário:', parseError);
            setUser(null);
          }
        }

        if (!token || !userLog) {
          console.log('Token ou userLog não encontrados');
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar usuário:", error);
        setUser(null);
      }
    };

    initializeUser();
  }, [setUser]);

  useEffect(() => {
    console.log('Estado atual do user:', user);
  }, [user]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Acesso restrito. Apenas administradores podem registrar pagamentos.');
      setLoading(false);
      return;
    }

    if (!id) {
      setError('ID do aluno não encontrado');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const alunoResponse = await api.get(`/alunos/${id}`);
        if (!alunoResponse.data) {
          throw new Error('Dados do aluno não encontrados');
        }
        setAluno(alunoResponse.data);

        const contasResponse = await api.get('/contas');
        if (!contasResponse.data) {
          throw new Error('Dados das contas não encontrados');
        }
        setContas(contasResponse.data);

        const pagamentosResponse = await api.get(`/pagamentos/aluno/${id}`);
        if (!pagamentosResponse.data) {
          throw new Error('Dados dos pagamentos não encontrados');
        }
        setPagamentos(pagamentosResponse.data.pagamentos || []);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error.response?.data?.details || error.response?.data?.error || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user?.role !== 'admin') {
      setSnackbar({
        open: true,
        message: 'Acesso restrito. Apenas administradores podem registrar pagamentos.',
        severity: 'error'
      });
      return;
    }

    try {
      // Validar dados antes de enviar
      if (!formData.conta_id || !formData.mes_referencia || !formData.valor) {
        setSnackbar({
          open: true,
          message: 'Por favor, preencha todos os campos obrigatórios',
          severity: 'error'
        });
        return;
      }

      // Validar valor numérico
      const valorNumerico = parseFloat(formData.valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        setSnackbar({
          open: true,
          message: 'Por favor, insira um valor válido maior que zero',
          severity: 'error'
        });
        return;
      }

      // Obter a data atual no fuso horário brasileiro
      const dataAtual = new Date();
      const dataBrasil = new Date(dataAtual.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

      // Formatar o mês de referência corretamente
      const [ano, mes] = formData.mes_referencia.split('-');
      const mesReferencia = `${ano}-${mes}-01`; // Primeiro dia do mês

      console.log('Dados do usuário antes de enviar:', user);
      const dataToSend = {
        aluno_id: parseInt(id),
        conta_id: parseInt(formData.conta_id),
        mes_referencia: mesReferencia,
        valor: valorNumerico,
        recebido_por: user?.nome || 'Usuário não identificado',
        recebido_por_id: user?.id || null,
        observacao: formData.observacao || '',
        data_pagamento: dataBrasil.toISOString()
      };

      console.log('Dados a serem enviados:', dataToSend);

      const response = await api.post('/pagamentos', dataToSend);
      
      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }

      // Atualizar a lista de pagamentos
      const pagamentosResponse = await api.get(`/pagamentos/aluno/${id}`);
      setPagamentos(pagamentosResponse.data.pagamentos || []);
      
      // Limpar o formulário
      setFormData({
        conta_id: '',
        mes_referencia: '',
        valor: '',
        recebido_por: '',
        observacao: ''
      });

      setSnackbar({
        open: true,
        message: 'Pagamento registrado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erro ao registrar pagamento',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className="payment-loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error-container">
        <p className="payment-error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="payment-error-container">
        <p className="payment-error-message">Acesso restrito. Apenas administradores podem registrar pagamentos.</p>
        <button onClick={() => navigate('/alunos')} className="retry-button">
          Voltar para Lista de Alunos
        </button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {error && (
        <div className="payment-error-container">
          <p className="payment-error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      )}

      {!error && aluno && (
        <>
          <div className="payment-header">
            <h1 className="payment-title">Pagamentos - {aluno.nome}</h1>
            <VoltarButton url={`/mensalidade/${id}`} />
          </div>

          <div className="payment-content">
            <div className="payment-form-container">
              <div className="payment-form">
                <h2>Registrar Novo Pagamento</h2>
                <form onSubmit={handleSubmit}>
                  <div className="payment-form-group">
                    <label>Conta</label>
                    <select
                      value={formData.conta_id || ''}
                      onChange={handleInputChange}
                      name="conta_id"
                      required
                    >
                      <option value="">Selecione uma conta</option>
                      {contas && contas.map(conta => (
                        <option key={conta.id} value={conta.id}>
                          {conta.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="payment-form-group">
                    <label>Mês de Referência</label>
                    <input
                      type="month"
                      name="mes_referencia"
                      value={formData.mes_referencia || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="payment-form-group">
                    <label>Valor</label>
                    <input
                      type="number"
                      name="valor"
                      value={formData.valor || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="R$"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="payment-form-group">
                    <label>Observação</label>
                    <textarea
                      name="observacao"
                      value={formData.observacao || ''}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  <button type="submit" className="payment-submit-button">
                    Registrar Pagamento
                  </button>
                </form>
              </div>
            </div>

            <div className="payment-history-container">
              <div className="payment-history">
                <h2>Histórico de Pagamentos</h2>
                {pagamentos && pagamentos.length > 0 ? (
                  <table className="payment-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Mês Referência</th>
                        <th>Valor</th>
                        <th>Recebido Por</th>
                        <th>Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagamentos.map(pagamento => {
                        if (!pagamento) return null;
                        
                        // Converter a data para o fuso horário brasileiro
                        const dataPagamento = new Date(pagamento.data_pagamento);
                        const dataBrasil = new Date(dataPagamento.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

                        return (
                          <tr key={pagamento.id}>
                            <td>{dataBrasil.toLocaleDateString('pt-BR')} {dataBrasil.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{new Date(pagamento.mes_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                            <td>R$ {parseFloat(pagamento.valor).toFixed(2)}</td>
                            <td>{pagamento.recebido_por || '-'}</td>
                            <td>{pagamento.observacao || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-payments">Nenhum pagamento registrado</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {snackbar.open && (
        <div className={`payment-snackbar ${snackbar.severity}`}>
          {snackbar.message}
          <button onClick={handleCloseSnackbar} className="payment-close-button">×</button>
        </div>
      )}
    </div>
  );
};

export default Pagamento; 