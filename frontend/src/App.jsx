import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UseContext";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import EsqueciASenha from "./components/EsqueciASenha/EsqueciASenha";

import AddMaterialEUtensilio from "./components/AddMaterial/AddMaterialEUtensilo";
import Diploma from "./components/Diploma/Diploma"
import Header from "./components/Header/Header";

import AddAluno from "./components/AddAluno/AddAluno";
import EditAluno from "./components/EditAluno/EditAluno";
import Alunos from "./components/Alunos/Alunos";

import AddCurso from "./components/AddCurso/AddCurso";
import EditCurso from "./components/EditCurso/EditCurso";
import Cursos from "./components/Cursos/Cursos";

import AddDisciplina from "./components/AddDisciplina/AddDisciplina";
import EditDisciplina from "./components/EditDisciplina/EditDisciplina";
import Disciplinas from "./components/Disciplinas/Disciplinas";

import AddAdmin from "./components/AddAdmin/AddAdmin";
import EditAdmin from "./components/EditAdmin/EditAdmin";
import Admins from "./components/Admin/Admin";

import AddProfessor from "./components/AddProfessor/AddProfessor";
import EditProfessor from "./components/EditProfessor/EditProfessor";
import Professores from "./components/Professores/Professores";

import AddRegistroAcademico from "./components/AddRegistroAcademico/AddRegistroAcademico";
import EditRegistroAcademico from "./components/EditRegistroAcademico/EditRegistroAcademico";
import RegistroAcademico from './components/RegistroAcademico/RegistroAcademicoAluno';
import DetalhesAluno from './components/RegistroAcademico/DetalhesAlunos';
import Boletim from './components/Boletim/Boletim';


import Dashboard from './components/Dashboard/Dashboard';
import Transacoes from './components/Transacoes/Transacoes';
import AdicionarTransacao from './components/AddTransacao/AddTransacao';
import AdicionarConta from './components/AdicionarConta/AdicionarConta';
import Turnos from './components/Turnos/Turnos';
import AddTurnos from './components/Addturnos/AddTurnos';
import MaterialEUtensilio from './components/MaterialEUtensilio/MaterialEUtensilio';
import EditMaterialEUtensilio from './components/EditMaterialEUtensilio/EditMaterialEUtensilio';
import Mensalidade from './components/Mensalidade/Mensalidade';
import Pagamento from './components/Pagamento/Pagamento';


function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/esqueciaasenha" element={<EsqueciASenha />} />

          <Route path="/alunos/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddAluno /> : <Navigate to="/login" />} />
          <Route path="/alunos/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditAluno /> : <Navigate to="/login" />} />
          <Route path="/alunos" element={user && ((user.role?.role === 'admin' || user.role === 'admin') || (user.role?.role === 'professor' || user.role === 'professor')) ? <Alunos /> : <Navigate to="/login" />} />

          <Route path="/cursos/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddCurso /> : <Navigate to="/login" />} />
          <Route path="/cursos/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditCurso /> : <Navigate to="/login" />} />
          <Route path="/cursos" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Cursos /> : <Navigate to="/login" />} />

          <Route path="/disciplinas/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddDisciplina /> : <Navigate to="/login" />} />
          <Route path="/disciplinas/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditDisciplina /> : <Navigate to="/login" />} />
          <Route path="/disciplinas" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Disciplinas /> : <Navigate to="/login" />} />

          <Route path="/admins/create" element={<AddAdmin />} />
          <Route path="/admins/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditAdmin /> : <Navigate to="/login" />} />
          <Route path="/admins" element={<Admins />} />

          <Route path="/professores/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditProfessor /> : <Navigate to="/login" />} />
          <Route path="/professores" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Professores /> : <Navigate to="/login" />} />

          <Route path="/registroacademico" element={user && ((user.role?.role === 'admin' || user.role === 'admin') || (user.role?.role === 'professor' || user.role === 'professor')) ? <RegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/create" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddRegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/edit/:id" element={user && ((user.role?.role === 'professor' || user.role === 'professor') || (user.role?.role === 'admin' || user.role === 'admin')) ? <EditRegistroAcademico /> : <Navigate to="/login" />} />
          <Route path="/registroacademico/:id" element={user && ((user.role?.role === 'professor' || user.role === 'professor') || (user.role?.role === 'admin' || user.role === 'admin')) ? <DetalhesAluno /> : <Navigate to="/login" />} />

          <Route path="/diplomas/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Diploma /> : <Navigate to="/" />} />
          <Route path="/boletim/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Boletim /> : <Navigate to="/" />} />
          <Route path="/turnos/" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Turnos /> : <Navigate to="/" />} />
          <Route path="/turnos/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddTurnos /> : <Navigate to="/" />} />

          <Route path="/materialeutensilios" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <MaterialEUtensilio /> : <Navigate to="/" />} />
          <Route path="/materialeutensilios/add" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AddMaterialEUtensilio /> : <Navigate to="/" />} />
          <Route path="/materialeutensilios/edit/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <EditMaterialEUtensilio /> : <Navigate to="/" />} />

          <Route path="/dashboard" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/transacoes" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Transacoes /> : <Navigate to="/" />} />
          <Route path="/adicionar-transacao" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AdicionarTransacao /> : <Navigate to="/" />} />
          <Route path="/adicionar-conta" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <AdicionarConta /> : <Navigate to="/" />} />
          <Route path="/mensalidade/:id" element={user && (user.role?.role === 'admin' || user.role === 'admin') ? <Mensalidade /> : <Navigate to="/" />} />
          <Route path="/pagamento/:aluno_id" element={<Pagamento />} />
          
          {/* Rota principal que renderiza a Home */}
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
