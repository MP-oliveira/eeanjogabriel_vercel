import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/api"; // Certifique-se de que o caminho está correto
import Edit from '../../assets/pencil.svg';
import Delete from '../../assets/trash.svg';


const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await api.get('/turnos'); // Verifique se a rota está correta
        setTurnos(response.data);
        setFilteredTurnos(response.data);
      } catch (error) {
        console.error('Erro ao buscar turnos:', error);
      }
    };
    fetchTurnos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = turnos.filter(turno =>
      turno.nome.toLowerCase().includes(value.toLowerCase()) // Supondo que cada turno tem um campo 'nome'
    );
    setFilteredTurnos(filtered);
  };

  const handleDelete = (id) => {
    // Implemente a lógica para deletar um turno
    console.log(`Deletando turno com ID: ${id}`);
  };

  return (
    <div className="form-container">
      <div className="form-list-content">
        <div className="form-list-top">
          <h1 className="form-list-top-h1">Gerenciamento de Turnos</h1>
          <Link className="form-criar" to="/turnos/add">Adicionar Turno</Link>
        </div>
        <div className="form-list-input">
          <input
            className='form-list-input-input'
            type="text"
            placeholder="Buscar por nome do turno"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <table className="tabela-form-lista tabela-form-lista-mobile">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurnos.length > 0 ? (
              filteredTurnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.nome}</td>
                  <td>{turno.descricao}</td>
                  <td>{turno.status}</td>
                  <td className="for-list-acoes">
                    <Link to={`/turnos/edit/${turno.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(turno.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhum turno encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Cards responsivos para telas menores de 430px */}
        <div className="turnos-cards-mobile">
          {filteredTurnos.length > 0 ? (
            filteredTurnos.map((turno) => (
              <div className="aluno-card" key={turno.id}>
                <div className="aluno-card-header">
                  <span className="aluno-card-nome">{turno.nome}</span>
                  <div className="aluno-card-actions">
                    <Link to={`/turnos/edit/${turno.id}`}>
                      <img src={Edit} alt="Editar" />
                    </Link>
                    <Link onClick={() => handleDelete(turno.id)}>
                      <img src={Delete} alt="Deletar" />
                    </Link>
                  </div>
                </div>
                <div className="aluno-card-info">
                  <div><strong>Descrição:</strong> {turno.descricao}</div>
                  <div><strong>Status:</strong> {turno.status}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="aluno-card-empty">Nenhum turno encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Turnos; 