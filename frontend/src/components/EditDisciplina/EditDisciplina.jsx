import "../EditAluno/Edit.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import VoltarButton from '../VoltarButton/VoltarButton';

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  modulo: z
    .string()
    .min(1, { message: "Selecione um módulo" }),
  carga_horaria:
    z.number()
      .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio:
    z.number()
      .min(0, { message: "A carga horária do estágio não pode ser negativa" }),
  estagio_supervisionado: z.string().min(1, { message: "Selecione se tem estágio supervisionado" }),
  duracao:
    z.number()
      .min(1, { message: "A duração precisa ser maior que 0" }),
  curso_id: z.union([z.string(), z.number()]).transform(val => String(val)),
  professor_id: z.union([z.string(), z.number()]).transform(val => String(val)),
});

const EditDisciplina = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinaData, setDisciplinaData] = useState({
    nome: "",
    modulo: "",
    carga_horaria: 0,
    carga_horaria_estagio: 0,
    duracao: 0,
    curso_id: "",
    professor_id: "",
    estagio_supervisionado: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar dados da disciplina
        const disciplinaResponse = await api.get(`/disciplinas/${id}`);
        const disciplina = disciplinaResponse.data;

        setDisciplinaData({
          ...disciplina,
          carga_horaria: Number(disciplina.carga_horaria),
          carga_horaria_estagio: Number(disciplina.carga_horaria_estagio),
          duracao: Number(disciplina.duracao),
          curso_id: String(disciplina.curso_id),
          professor_id: String(disciplina.professor_id),
          estagio_supervisionado: disciplina.estagio_supervisionado || ""
        });

        // Carregar lista de cursos
        const cursosResponse = await api.get('/cursos');
        setCursos(cursosResponse.data);

        // Carregar lista de professores
        const professoresResponse = await api.get('/professores');
        setProfessores(professoresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar os dados", error);
        setApiError(
          error.response?.data?.message ||
          'Erro ao carregar os dados. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar os dados
    const dataToValidate = {
      ...disciplinaData,
      carga_horaria: Number(disciplinaData.carga_horaria),
      carga_horaria_estagio: Number(disciplinaData.carga_horaria_estagio),
      duracao: Number(disciplinaData.duracao),
      curso_id: String(disciplinaData.curso_id),
      professor_id: String(disciplinaData.professor_id),
      estagio_supervisionado: disciplinaData.estagio_supervisionado
    };

    const disciplinaResult = disciplinaSchema.safeParse(dataToValidate);

    if (!disciplinaResult.success) {
      setErrors(disciplinaResult.error.format());
      return;
    }

    try {
      const dadosParaEnvio = {
        ...dataToValidate,
        curso_id: Number(dataToValidate.curso_id),
        professor_id: Number(dataToValidate.professor_id)
      };
      await api.put(`/disciplinas/edit/${id}`, dadosParaEnvio);
      navigate("/disciplinas");
    } catch (error) {
      console.error("Erro ao atualizar disciplina", error);
      setApiError("Erro ao atualizar disciplina. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    setDisciplinaData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (apiError) {
    return <div className="error">{apiError}</div>;
  }

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url='/disciplinas' />
        <h2>Editar Disciplina</h2>
        <input
          type="text"
          name="nome"
          value={disciplinaData.nome}
          onChange={handleChange}
          placeholder="Nome da Disciplina"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome._errors?.[0]}
          </p>
        )}
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              name="curso_id"
              value={disciplinaData.curso_id}
              onChange={handleChange}
            >
              <option value="">Selecione o Curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.curso_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.curso_id._errors?.[0]}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              name="professor_id"
              value={disciplinaData.professor_id}
              onChange={handleChange}
            >
              <option value="">Selecione o Professor</option>
              {professores.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome}
                </option>
              ))}
            </select>
          </div>
          {errors.professor_id && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.professor_id._errors?.[0]}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              name="modulo"
              value={disciplinaData.modulo}
              onChange={handleChange}
            >
              <option value="">Selecione o Módulo</option>
              <option value="1">Módulo 1</option>
              <option value="2">Módulo 2</option>
              <option value="3">Módulo 3</option>
              <option value="4">Módulo 4</option>
            </select>
          </div>
          {errors.modulo && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modulo._errors?.[0]}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          <input
            type="number"
            name="carga_horaria"
            value={disciplinaData.carga_horaria}
            onChange={handleChange}
            placeholder="Carga Horária"
          />
          {errors.carga_horaria && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria._errors?.[0]}
            </p>
          )}
          <input
            type="number"
            name="carga_horaria_estagio"
            value={disciplinaData.carga_horaria_estagio}
            onChange={handleChange}
            placeholder="Carga Horária Estágio"
          />
          {errors.carga_horaria_estagio && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.carga_horaria_estagio._errors?.[0]}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              name="estagio_supervisionado"
              value={disciplinaData.estagio_supervisionado}
              onChange={handleChange}
            >
              <option value="">Tem Estágio Supervisionado?</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          {errors.estagio_supervisionado && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estagio_supervisionado._errors?.[0]}
            </p>
          )}
        </div>
        <button className="aluno-btn" type="submit">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditDisciplina;