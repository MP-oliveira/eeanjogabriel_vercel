import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { UserProvider } from "./context/UseContext";
import { ErrorBoundary } from "./context/ErrorBoundary";
import Header from "./components/Header/Header";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import "./index.css";

// Lazy loading de todos os componentes
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Alunos = lazy(() => import("./pages/Alunos/Alunos"));
const Cursos = lazy(() => import("./pages/Cursos/Cursos"));
const Disciplinas = lazy(() => import("./pages/Disciplinas/Disciplinas"));
const MaterialEUtensilios = lazy(() => import("./pages/MaterialEUtensilios/MaterialEUtensilios"));
const Professores = lazy(() => import("./pages/Professores/Professores"));
const Turnos = lazy(() => import("./pages/Turnos/Turnos"));
const Admins = lazy(() => import("./pages/Admins/Admins"));
const Pagamento = lazy(() => import("./components/Pagamento/Pagamento"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute/ProtectedRoute"));
const AddAluno = lazy(() => import("./components/AddAluno/AddAluno"));
const EditAluno = lazy(() => import("./components/EditAluno/EditAluno"));
const AddCurso = lazy(() => import("./components/AddCurso/AddCurso"));
const EditCurso = lazy(() => import("./components/EditCurso/EditCurso"));
const AddDisciplina = lazy(() => import("./components/AddDisciplina/AddDisciplina"));
const EditDisciplina = lazy(() => import("./components/EditDisciplina/EditDisciplina"));
const AddAdmin = lazy(() => import("./components/AddAdmin/AddAdmin"));
const EditAdmin = lazy(() => import("./components/EditAdmin/EditAdmin"));
const AddProfessor = lazy(() => import("./components/AddProfessor/AddProfessor"));
const EditProfessor = lazy(() => import("./components/EditProfessor/EditProfessor"));
const AddRegistroAcademico = lazy(() => import("./components/AddRegistroAcademico/AddRegistroAcademico"));
const EditRegistroAcademico = lazy(() => import("./components/EditRegistroAcademico/EditRegistroAcademico"));
const RegistroAcademico = lazy(() => import("./components/RegistroAcademico/RegistroAcademicoAluno"));
const DetalhesAluno = lazy(() => import("./components/RegistroAcademico/DetalhesAlunos"));
const Boletim = lazy(() => import("./components/Boletim/Boletim"));
const Transacoes = lazy(() => import("./components/Transacoes/Transacoes"));
const AdicionarTransacao = lazy(() => import("./components/AddTransacao/AddTransacao"));
const AdicionarConta = lazy(() => import("./components/AdicionarConta/AdicionarConta"));
const AddTurnos = lazy(() => import("./components/Addturnos/AddTurnos"));
const EditMaterialEUtensilio = lazy(() => import("./components/EditMaterialEUtensilio/EditMaterialEUtensilio"));
const Mensalidade = lazy(() => import("./components/Mensalidade/Mensalidade"));
const EsqueciASenha = lazy(() => import("./components/EsqueciASenha/EsqueciASenha"));
const Diploma = lazy(() => import("./components/Diploma/Diploma"));

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar se o localStorage está disponível
        if (typeof window === 'undefined' || !window.localStorage) {
          throw new Error('localStorage não está disponível neste ambiente');
        }

        // Verificar se há dados corrompidos no localStorage
        const checkLocalStorage = () => {
          const keys = ['token', 'user'];
          for (const key of keys) {
            try {
              const value = localStorage.getItem(key);
              if (value) {
                JSON.parse(value);
              }
            } catch (e) {
              console.error(`Erro ao fazer parse dos dados do localStorage (${key}):`, e);
              localStorage.removeItem(key);
            }
          }
        };

        checkLocalStorage();
        setIsInitialized(true);
      } catch (err) {
        console.error('Erro ao inicializar a aplicação:', err);
        setError(err.message);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#1E56B8',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Erro ao carregar a aplicação</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1E56B8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/esqueci-a-senha" element={<EsqueciASenha />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/alunos"
                    element={
                      <ProtectedRoute>
                        <Alunos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cursos"
                    element={
                      <ProtectedRoute>
                        <Cursos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/disciplinas"
                    element={
                      <ProtectedRoute>
                        <Disciplinas />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/materialeutensilios"
                    element={
                      <ProtectedRoute>
                        <MaterialEUtensilios />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/professores"
                    element={
                      <ProtectedRoute>
                        <Professores />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/turnos"
                    element={
                      <ProtectedRoute>
                        <Turnos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admins"
                    element={
                      <ProtectedRoute>
                        <Admins />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pagamento/:alunoId"
                    element={
                      <ProtectedRoute>
                        <Pagamento />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addaluno"
                    element={
                      <ProtectedRoute>
                        <AddAluno />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editaluno/:id"
                    element={
                      <ProtectedRoute>
                        <EditAluno />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addcurso"
                    element={
                      <ProtectedRoute>
                        <AddCurso />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editcurso/:id"
                    element={
                      <ProtectedRoute>
                        <EditCurso />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/adddisciplina"
                    element={
                      <ProtectedRoute>
                        <AddDisciplina />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editdisciplina/:id"
                    element={
                      <ProtectedRoute>
                        <EditDisciplina />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addadmin"
                    element={
                      <ProtectedRoute>
                        <AddAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editadmin/:id"
                    element={
                      <ProtectedRoute>
                        <EditAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addprofessor"
                    element={
                      <ProtectedRoute>
                        <AddProfessor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editprofessor/:id"
                    element={
                      <ProtectedRoute>
                        <EditProfessor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addregistroacademico"
                    element={
                      <ProtectedRoute>
                        <AddRegistroAcademico />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editregistroacademico/:id"
                    element={
                      <ProtectedRoute>
                        <EditRegistroAcademico />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/registroacademico/:alunoId"
                    element={
                      <ProtectedRoute>
                        <RegistroAcademico />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/detalhesaluno/:alunoId"
                    element={
                      <ProtectedRoute>
                        <DetalhesAluno />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/boletim/:alunoId"
                    element={
                      <ProtectedRoute>
                        <Boletim />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transacoes"
                    element={
                      <ProtectedRoute>
                        <Transacoes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/adicionar-transacao"
                    element={
                      <ProtectedRoute>
                        <AdicionarTransacao />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/adicionar-conta"
                    element={
                      <ProtectedRoute>
                        <AdicionarConta />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addturno"
                    element={
                      <ProtectedRoute>
                        <AddTurnos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editmaterialeutensilio/:id"
                    element={
                      <ProtectedRoute>
                        <EditMaterialEUtensilio />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mensalidade/:alunoId"
                    element={
                      <ProtectedRoute>
                        <Mensalidade />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/diploma/:alunoId"
                    element={
                      <ProtectedRoute>
                        <Diploma />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Suspense>
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
