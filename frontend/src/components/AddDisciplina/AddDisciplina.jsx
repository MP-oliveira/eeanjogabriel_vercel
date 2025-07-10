import "./AddDisciplina.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";

const disciplinaSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  modulo: z.string().min(1, { message: "Selecione um módulo" }),
  carga_horaria: z
    .number()
    .min(1, { message: "A carga horária precisa ser maior que 0" }),
  carga_horaria_estagio: z
    .number()
    .min(0),
  estagio_supervisionado: z
    .string()
    .min(1, { message: "Selecione se tem estágio supervisionado" }),
  duracao: z.number().min(1, { message: "A duração precisa ser maior que 0" }),
  curso_id: z.number().min(1, { message: "Selecione um curso" }),
  professor_id: z.number().min(1, { message: "Selecione um professor" })
});

const AddDisciplina = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [carga_horaria, setCarga_horaria] = useState("");
  const [carga_horaria_estagio, setCarga_horaria_estagio] = useState("");
  const [estagio_supervisionado, setEstagio_supervisionado] = useState("");
  const [duracao, setDuracao] = useState("");
  const [curso_id, setCurso_id] = useState("");
  const [professor_id, setProfessor_id] = useState("");
  const [errors, setErrors] = useState({});
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [modulo, setModulo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, professoresResponse] = await Promise.all([
          api.get("/cursos"),
          api.get("/professores"),
        ]);
        setCursos(cursosResponse.data);
        setProfessores(professoresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const disciplinaFormValues = {
      nome,
      modulo,
      carga_horaria: Number(carga_horaria),
      carga_horaria_estagio:
        estagio_supervisionado === "Sim" ? Number(carga_horaria_estagio) : 0,
      estagio_supervisionado,
      duracao: Number(duracao),
      curso_id: Number(curso_id),
      professor_id: Number(professor_id)
    };

    const disciplinaresult = disciplinaSchema.safeParse(disciplinaFormValues);

    if (!disciplinaresult.success) {
      const fieldErrors = disciplinaresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        modulo: fieldErrors.modulo?._errors[0],
        carga_horaria: fieldErrors.carga_horaria?._errors[0],
        carga_horaria_estagio: fieldErrors.carga_horaria_estagio?._errors[0],
        estagio_supervisionado: fieldErrors.estagio_supervisionado?._errors[0],
        duracao: fieldErrors.duracao?._errors[0],
        curso_id: fieldErrors.curso_id?._errors[0],
        professor_id: fieldErrors.professor_id?._errors[0]
      });
    } else {
      setIsLoading(true);
      try {
        const response = await api.post(
          "/disciplinas/create",
          disciplinaresult.data
        );
        alert("Disciplina adicionada com sucesso!");
        setNome("");
        setModulo("");
        setCarga_horaria("");
        setCarga_horaria_estagio("");
        setEstagio_supervisionado("");
        setDuracao("");
        setCurso_id("");
        setProfessor_id("");
        navigate("/disciplinas");
      } catch (error) {
        console.error("Erro ao adicionar disciplina", error);
        alert("Erro ao adicionar disciplina. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/disciplinas" />
        <h2>Adicionar Disciplina</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Disciplina"
        />
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={curso_id}
              onChange={(e) => setCurso_id(e.target.value)}
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
              {errors.curso_id}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              value={professor_id}
              onChange={(e) => setProfessor_id(e.target.value)}
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
              {errors.professor_id}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              value={modulo}
              onChange={(e) => setModulo(e.target.value)}
            >
              <option value="">Selecione o Módulo</option>
              <option value="1">Módulo 1</option>
              <option value="2">Módulo 2</option>
              <option value="3">Módulo 3</option>
            </select>
          </div>
          {errors.modulo && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.modulo}
            </p>
          )}
        </div>
        <input
          type="number"
          value={carga_horaria}
          onChange={(e) => setCarga_horaria(e.target.value)}
          placeholder="Carga Horária"
        />
        {errors.carga_horaria && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.carga_horaria}
          </p>
        )}
        <input
          type="number"
          value={carga_horaria_estagio}
          onChange={(e) => setCarga_horaria_estagio(e.target.value)}
          placeholder="Carga Horária Estágio"
        />
        {errors.carga_horaria_estagio && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.carga_horaria_estagio}
          </p>
        )}
        <div className="custom-select-wrapper">
          <select
            value={estagio_supervisionado}
            onChange={(e) => setEstagio_supervisionado(e.target.value)}
          >
            <option value="">Tem Estágio Supervisionado?</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        {errors.estagio_supervisionado && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.estagio_supervisionado}
          </p>
        )}
        <input
          type="number"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          placeholder="Duração (em semanas)"
        />
        {errors.duracao && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.duracao}
          </p>
        )}
        <button
          className="aluno-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adicionando..." : "Adicionar Disciplina"}
        </button>
      </form>
    </div>
  );
};

export default AddDisciplina;
