import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [filteredProfessores, setFilteredProfessores] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await api.get('/professores');
        setProfessores(response.data);
        setFilteredProfessores(response.data);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
      }
    };
    fetchProfessores();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = professores.filter(professor =>
      professor.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProfessores(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/professores/${id}`);
      setProfessores(professores.filter((professor) => professor.id !== id));
      setFilteredProfessores(filteredProfessores.filter((professor) => professor.id !== id));
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Professores</h1>
          <Link className="form-criar" to="/professores/add">Add Professor</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do professor"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista tabela-form-lista-mobile">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.length > 0 ? (
              filteredProfessores.map((prof) => (
                <tr key={prof.id}>
                  <td>{prof.nome}</td>
                  <td>{prof.email}</td>
                  <td>{prof.telefone}</td>
                  <td>{prof.status}</td>
                  <td className="for-list-acoes">
                    <Link to={`/professores/edit/${prof.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(prof.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum professor encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Cards responsivos para telas menores de 430px */}
        <div className="professores-cards-mobile">
          {filteredProfessores.length > 0 ? (
            filteredProfessores.map((prof) => (
              <div className="aluno-card" key={prof.id}>
                <div className="aluno-card-header">
                  <span className="aluno-card-nome">{prof.nome}</span>
                  <div className="aluno-card-actions">
                    <Link to={`/professores/edit/${prof.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(prof.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </div>
                </div>
                <div className="aluno-card-info">
                  <div><strong>Email:</strong> {prof.email}</div>
                  <div><strong>Telefone:</strong> {prof.telefone}</div>
                  <div><strong>Status:</strong> {prof.status}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="aluno-card-empty">Nenhum professor encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Professores;
