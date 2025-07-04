import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api";
import Delete from '../../assets/trash.svg';
import Edit from '../../assets/pencil.svg';
import '../Alunos/Alunos.css';


const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {

        const response = await api.get('/disciplinas');
        setDisciplinas(response.data);
        setFilteredDisciplinas(response.data);
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };
    fetchDisciplinas();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDisciplinas(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/disciplinas/${id}`);
      setDisciplinas(disciplinas.filter((disciplina) => disciplina.id !== id));
      setFilteredDisciplinas(filteredDisciplinas.filter((disciplina) => disciplina.id !== id));
    } catch (error) {
      console.error('Erro ao deletar disciplina:', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Disciplinas</h1>
          <Link className="form-criar" to="/disciplinas/add">Add Disciplina</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do disciplina"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista tabela-form-lista-mobile">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisciplinas.length > 0 ? (
              filteredDisciplinas.map((disc) => (
                <tr key={disc.id}>
                  <td>{disc.nome}</td>
                  <td>{disc.codigo}</td>
                  <td>{disc.descricao}</td>
                  <td>{disc.status}</td>
                  <td className="for-list-acoes">
                    <Link to={`/disciplinas/edit/${disc.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(disc.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhuma disciplina encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Cards responsivos para telas menores de 430px */}
        <div className="disciplinas-cards-mobile">
          {filteredDisciplinas.length > 0 ? (
            filteredDisciplinas.map((disc) => (
              <div className="aluno-card" key={disc.id}>
                <div className="aluno-card-header">
                  <span className="aluno-card-nome">{disc.nome}</span>
                  <div className="aluno-card-actions">
                    <Link to={`/disciplinas/edit/${disc.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(disc.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </div>
                </div>
                <div className="aluno-card-info">
                  <div><strong>Código:</strong> {disc.codigo}</div>
                  <div><strong>Descrição:</strong> {disc.descricao}</div>
                  <div><strong>Status:</strong> {disc.status}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="aluno-card-empty">Nenhuma disciplina encontrada</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;
