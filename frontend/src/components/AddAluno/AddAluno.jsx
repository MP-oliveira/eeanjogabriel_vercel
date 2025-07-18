import { useEffect, useState } from "react";
import api from "../../services/api"; // Importando o serviço de API
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import VoltarButton from "../VoltarButton/VoltarButton";
import InputMask from 'react-input-mask';


// Regex para CPF com ou sem pontuação
const cpfRegex = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/;

// Regex para RG com ou sem pontuação

// Regex para telefone celular e fixo com ou sem pontuação
const celularRegex = /^(\d{2})?\s?\d{5}-?\d{4}$/;

// Regex para CEP com ou sem hífen
const cepRegex = /^\d{5}-?\d{3}$/;

const alunoSchema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.coerce.string().email({ message: "Digite um email válido." }).min(5),
  data_nascimento: z.string().min(1, { message: "Informe a data de nascimento" }),
  estado_civil: z.string({ message: "Selecione uma opção" }),
  naturalidade: z.string().min(3, { message: "Digite uma naturalidade válida" }),
  nacionalidade: z.string().min(3, { message: "Digite uma nacionalidade válida" }),
  pai: z.string(),
  mae: z.string(),
  cpf: z.string().refine((value) => cpfRegex.test(value), { message: "CPF inválido" }),
  endereco: z.string(),
  n_casa: z.string(),
  bairro: z.string(),
  celular: z.string().refine((value) => celularRegex.test(value), { message: "Celular inválido" }),
  cep: z.string().refine((value) => cepRegex.test(value), { message: "CEP inválido" }),
  cidade: z.string(),
  estado: z.string(),
  curso_id: z.string().min(1, { message: "Selecione um curso" }),
  turno_id: z.string().min(1, { message: "Selecione um turno" }),
  data_matricula: z.string().min(1, { message: "Informe a data de matrícula" }),
  data_termino_curso: z.string().min(1, { message: "Informe a data de termino do curso" })
});

const AddAluno = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [data_nascimento, setData_nascimento] = useState("");
  const [estado_civil, setEstado_civil] = useState("");
  const [naturalidade, setNaturalidade] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [pai, setPai] = useState("");
  const [mae, setMae] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [n_casa, setN_casa] = useState("");
  const [bairro, setBairro] = useState("");
  const [celular, setCelular] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [curso_id, setCurso_id] = useState(0);
  const [turno_id, setTurno_id] = useState("");
  const [data_matricula, setData_matricula] = useState("");
  const [data_termino_curso, setData_termino_curso] = useState("");
  const [file, setFile] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [errors, setErrors] = useState({});
  const [cursos, setCursos] = useState([]);
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosResponse, turnosResponse] = await Promise.all([
          api.get("/cursos"),
          api.get("/turnos"),
        ]);
        setCursos(cursosResponse.data);
        setTurnos(turnosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  console.log('turno e curso no add aluno', cursos, turnos)

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleHistoricoChange = (event) => {
    setHistorico(event.target.files[0]);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando formulário");

    // Converter data_nascimento para YYYY-MM-DD se estiver no formato DD/MM/AAAA
    let dataNascimentoFormatada = data_nascimento;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_nascimento)) {
      const [dia, mes, ano] = data_nascimento.split('/');
      dataNascimentoFormatada = `${ano}-${mes}-${dia}`;
    }
    // Converter data_matricula para YYYY-MM-DD se estiver no formato DD/MM/AAAA
    let dataMatriculaFormatada = data_matricula;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_matricula)) {
      const [dia, mes, ano] = data_matricula.split('/');
      dataMatriculaFormatada = `${ano}-${mes}-${dia}`;
    }

    let dataTerminoCursoFormatada = data_termino_curso;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_termino_curso)) {
      const [dia, mes, ano] = data_matricula.split('/');
      dataTerminoCursoFormatada = `${ano}-${mes}-${dia}`;
    }

    const alunoFormValues = {
      nome,
      email,
      data_nascimento: dataNascimentoFormatada,
      estado_civil,
      naturalidade,
      nacionalidade,
      pai,
      mae,
      cpf,
      endereco,
      n_casa,
      bairro,
      celular,
      cep,
      cidade,
      estado,
      curso_id,
      turno_id,
      data_matricula: dataMatriculaFormatada,
      data_termino_curso: dataTerminoCursoFormatada,
    };
 
    // Validando os dados com o esquema do Zod
    const alunoresult = alunoSchema.safeParse(alunoFormValues);
    console.log("Resultado da validação:", alunoresult);

    // Se houver erros, eles serão exibidos
    if (!alunoresult.success) {
      const fieldErrors = alunoresult.error.format();
      setErrors({
        nome: fieldErrors.nome?._errors[0],
        email: fieldErrors.email?._errors[0],
        data_nascimento: fieldErrors.data_nascimento?._errors[0],
        estado_civil: fieldErrors.estado_civil?._errors[0],
        naturalidade: fieldErrors.naturalidade?._errors[0],
        nacionalidade: fieldErrors.nacionalidade?._errors[0],
        pai: fieldErrors.pai?._errors[0],
        mae: fieldErrors.mae?._errors[0],
        cpf: fieldErrors.cpf?._errors[0],
        endereco: fieldErrors.endereco?._errors[0],
        n_casa: fieldErrors.n_casa?._errors[0],
        bairro: fieldErrors.bairro?._errors[0],
        celular: fieldErrors.celular?._errors[0],
        cep: fieldErrors.cep?._errors[0],
        cidade: fieldErrors.cidade?._errors[0],
        estado: fieldErrors.estado?._errors[0],
        curso_id: fieldErrors.curso_id?._errors[0],
        turno_id: fieldErrors.turno_id?._errors[0],
        data_matricula: fieldErrors.data_matricula?._errors[0],
        data_termino_curso: fieldErrors.data_termino_curso?._errors[0],
      });
    } else {
      try {
        const formData = new FormData();
        formData.append("nome", alunoresult.data.nome);
        formData.append("email", alunoresult.data.email);
        formData.append("data_nascimento", dataNascimentoFormatada);
        formData.append("estado_civil", alunoresult.data.estado_civil);
        formData.append("naturalidade", alunoresult.data.naturalidade);
        formData.append("nacionalidade", alunoresult.data.nacionalidade);
        formData.append("pai", alunoresult.data.pai);
        formData.append("mae", alunoresult.data.mae);
        formData.append("cpf", alunoresult.data.cpf);
        formData.append("endereco", alunoresult.data.endereco);
        formData.append("n_casa", alunoresult.data.n_casa);
        formData.append("bairro", alunoresult.data.bairro);
        formData.append("celular", alunoresult.data.celular);
        formData.append("cep", alunoresult.data.cep);
        formData.append("cidade", alunoresult.data.cidade);
        formData.append("estado", alunoresult.data.estado);
        formData.append("curso_id", alunoresult.data.curso_id);
        formData.append("turno_id", alunoresult.data.turno_id);
        formData.append("data_matricula", dataMatriculaFormatada);
        formData.append( "data_termino_curso",dataTerminoCursoFormatada );
        formData.append("file", file);
        formData.append("historico", historico);

        console.log("form data",formData)

        // Enviar os dados para a API
        // const response = await api.post("/alunos/create", alunoFormValues);
        const response = await api.post("/alunos/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // .then((res) => console.log(res))
        // .catch((err) => console.log(err));

        alert(`Upload bem-sucedido: ${response.data.fileUrl}`);
        console.log("Usuário adicionado com sucesso!", response.data);

        // zerar os inputs
        setNome(""),
          setEmail(""),
          setData_nascimento(""),
          setEstado_civil("Estado Civil"),
          setNaturalidade(""),
          setNacionalidade(""),
          setPai(""),
          setMae(""),
          setCpf(""),
          setEndereco(""),
          setN_casa(""),
          setBairro(""),
          setCelular(""),
          setCep(""),
          setCidade(""),
          setEstado("Selecione o estado"),
          setCurso_id(""),
          setTurno_id(""),
          setData_matricula(""),
          // setData_termino_curso("");
        navigate("/alunos");
      } catch (error) {
        console.error("Erro ao adicionar usuário", error);
      }
      // Se passar na validação, pode enviar os dados ou executar outras ações
      // console.log("Dados válidos", alunoresult.data);
      setErrors({}); // Limpa os erros se a validação for bem-sucedida
    }
  };

  return (
    <div className="form-container">
      <form className="form-add" onSubmit={handleSubmit}>
        <VoltarButton url="/alunos" />

        <h2>Adicionar Aluno</h2>
        <input
          id="nome"
          type="text"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        {/* Exibe a mensagem de erro do campo nome, se houver */}
        {errors.nome && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.nome}
          </p>
        )}
        <div className="input-three-columns">
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {/* Exibe a mensagem de erro do campo email, se houver */}
          {errors.email && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.email}
            </p>
          )}
          <div className="input-date-wrapper">
            <InputMask
              mask="99/99/9999"
              value={data_nascimento}
              onChange={(e) => setData_nascimento(e.target.value)}
              placeholder="Data de Nascimento"
              id="data_nascimento"
              name="data_nascimento"
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
            {errors.data_nascimento && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.data_nascimento}
              </p>
            )}
          </div>
          <div className="custom-select-wrapper">
            <select onChange={(e) => setEstado_civil(e.target.value)}>
              <option value="">Estado civil</option>
              <option value="Solteiro">Solteiro(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="Viuvo">Viuvo(a)</option>
            </select>
          </div>
          {errors.estado_civil && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.estado_civil}
            </p>
          )}
        </div>
        <div className="input-three-columns">
          {/* Removido grupo sanguíneo */}
          <input
            type="text"
            value={naturalidade}
            onChange={(e) => setNaturalidade(e.target.value)}
            placeholder="Naturalidade"
          />
          {errors.naturalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.naturalidade}
            </p>
          )}
          <input
            type="text"
            value={nacionalidade}
            onChange={(e) => setNacionalidade(e.target.value)}
            placeholder="Nacionalidade"
          />
          {errors.nacionalidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.nacionalidade}
            </p>
          )}
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
          />
          {errors.cpf && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cpf}
            </p>
          )}
     
        </div>
        <input
          type="text"
          value={pai}
          onChange={(e) => setPai(e.target.value)}
          placeholder="Nome do Pai"
        />
        <input
          type="text"
          value={mae}
          onChange={(e) => setMae(e.target.value)}
          placeholder="Nome da Mãe"
        />
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
        <div className="input-three-columns">
          <input
            type="text"
            value={n_casa}
            onChange={(e) => setN_casa(e.target.value)}
            placeholder="Número da Casa"
          />
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
          />
        </div>
        <input
          type="text"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          placeholder="Celular"
        />
        {errors.celular && (
          <p className="error_message" style={{ color: "red" }}>
            {errors.celular}
          </p>
        )}
        <div className="input-three-columns">
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="CEP"
          />
          {errors.cep && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cep}
            </p>
          )}
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
          />
          {errors.cidade && (
            <p className="error_message" style={{ color: "red" }}>
              {errors.cidade}
            </p>
          )}
          <div className="custom-select-wrapper">
            <select
              id="estado"
              name="estado"
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Selecione o estado</option>
              <option value="AC">Acre (AC)</option>
              <option value="AL">Alagoas (AL)</option>
              <option value="AP">Amapá (AP)</option>
              <option value="AM">Amazonas (AM)</option>
              <option value="BA">Bahia (BA)</option>
              <option value="CE">Ceará (CE)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="ES">Espírito Santo (ES)</option>
              <option value="GO">Goiás (GO)</option>
              <option value="MA">Maranhão (MA)</option>
              <option value="MT">Mato Grosso (MT)</option>
              <option value="MS">Mato Grosso do Sul (MS)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PA">Pará (PA)</option>
              <option value="PB">Paraíba (PB)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="PE">Pernambuco (PE)</option>
              <option value="PI">Piauí (PI)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="RN">Rio Grande do Norte (RN)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="RO">Rondônia (RO)</option>
              <option value="RR">Roraima (RR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="SE">Sergipe (SE)</option>
              <option value="TO">Tocantins (TO)</option>
            </select>
          </div>
        </div>
        <div className="input-three-columns">
          <div className="custom-select-wrapper">
            <select
              value={turno_id}
              onChange={(e) => setTurno_id(e.target.value)}
            >
              <option value="">Selecione o Turno</option>
              {turnos.map((turno) => (
                <option key={turno.id} value={turno.id}>
                  {turno.nome}
                </option>
              ))}
            </select>
            {errors.turno_id && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.turno_id}
              </p>
            )}
          </div>
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
          <div className="input-date-wrapper">
            <InputMask
              mask="99/99/9999"
              value={data_matricula}
              onChange={(e) => setData_matricula(e.target.value)}
              placeholder="Data de Matrícula"
              id="data_matricula"
              name="data_matricula"
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
            {errors.data_matricula && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.data_matricula}
              </p>
            )}
          </div>
          <div className="input-date-wrapper">
            <InputMask
              mask="99/99/9999"
              value={data_termino_curso}
              onChange={(e) => setData_termino_curso(e.target.value)}
              placeholder="Data de Término do Curso"
              id="data_termino_curso"
              name="data_termino_curso"
            >
              {(inputProps) => <input type="text" {...inputProps} />}
            </InputMask>
            {errors.data_termino_curso && (
              <p className="error_message" style={{ color: "red" }}>
                {errors.data_termino_curso}
              </p>
            )}
          </div>
        </div>
        <div className="input-file">
          <div className="input-file input-file-button">
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            Adicione sua Foto
          </div>
          <div className="input-file input-file-button">
            <input
              type="file"
              id="historico"
              name="historico"
              accept="application/pdf"
              onChange={handleHistoricoChange}
            />
            Adicione seu Histórico (.pdf até 10Mb)
          </div>
          {/* Removido campo de senha */}
        </div>
        <div className="form-btn-container">
          <button className="form-btn" type="submit">
            Adicionar Usuário
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAluno;
