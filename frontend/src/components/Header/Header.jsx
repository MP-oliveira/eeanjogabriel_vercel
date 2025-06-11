import { useEffect, useState, useContext } from "react";
import { UserCircle, List, X } from "phosphor-react";
import { UserContext } from "../../context/UseContext";
import Logo from "../../assets/Logo.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isBlurred, setIsBlurred] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsBlurred(true);
    } else {
      setIsBlurred(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userLog = localStorage.getItem("user");

        if (userLog) {
          try {
            const parsedUser = JSON.parse(userLog);
            if (parsedUser && parsedUser.user) {
              setUser({
                role: parsedUser.role,
                nome: parsedUser.user.nome || '',
                email: parsedUser.user.email || ''
              });
            } else {
              console.warn('Dados do usuário inválidos:', userLog);
              setUser(null);
            }
          } catch (parseError) {
            console.error('Erro ao fazer parse dos dados do usuário:', parseError);
            setUser(null);
          }
        }

        if (!token || !userLog) {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar usuário:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleNavigateAndScroll = (sectionId) => {
    if (!sectionId) return;

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      try {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 70;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          console.warn(`Seção ${sectionId} não encontrada`);
        }
      } catch (error) {
        console.error('Erro ao rolar para seção:', error);
      }
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (isLoading) {
    return (
      <header className="header loading">
        <div className="header__container">
          <div className="logo">
            <div className="img">
              <img src={Logo} alt="Escola de Enfermagem Anjo Gabriel" />
            </div>
            <div className="logo-text">
              <span className="logo-span-anjo">Anjo Gabriel</span>
              <span className="logo-span-escola">Escola de Enfermagem</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`header no-print ${isBlurred ? "blur" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="header__container">
        <div className="logo">
          <div className="img">
            <img src={Logo} alt="Escola de Enfermagem Anjo Gabriel" />
          </div>
          <div className="logo-text">
            <span className="logo-span-anjo">Anjo Gabriel</span>
            <span className="logo-span-escola">Escola de Enfermagem</span>
          </div>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <List size={24} />}
        </button>
        <div className={`links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink
              className="nav-link"
              to="/"
              onClick={e => {
                e.preventDefault();
                handleNavigateAndScroll("sectionOne");
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className="nav-link"
              to="/"
              onClick={e => {
                e.preventDefault();
                handleNavigateAndScroll("sectionTwo");
              }}
            >
              Nossos Cursos
            </NavLink>
          </li>
          <li>
            <NavLink
              className="nav-link"
              to="/"
              onClick={e => {
                e.preventDefault();
                handleNavigateAndScroll("sectionThree");
              }}
            >
              Nossa Estrutura
            </NavLink>
          </li>
          <li>
            <NavLink
              className="nav-link"
              to="/"
              onClick={e => {
                e.preventDefault();
                handleNavigateAndScroll("sectionFour");
              }}
            >
              Fale Conosco
            </NavLink>
          </li>
          <li className="dropdown">
            <NavLink
              className="nav-link dropdown-trigger"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <div className="dropdown-menu">
              {user?.role === "admin" ? (
                <>
                  <NavLink
                    to="/admins"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Administrador
                  </NavLink>
                  <NavLink
                    to="/alunos"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Alunos
                  </NavLink>
                  <NavLink
                    to="/cursos"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Cursos
                  </NavLink>
                  <NavLink
                    to="/disciplinas"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Disciplina
                  </NavLink>
                  <NavLink
                    to="/materialeutensilios"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Materiais e Utensílios
                  </NavLink>
                  <NavLink
                    to="/professores"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Professores
                  </NavLink>
                  <NavLink
                    to="/turnos"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Turno
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Financeiro
                  </NavLink>
                </>
              ) : user?.role === "professor" ? (
                <>
                  <NavLink
                    to="/alunos"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Alunos
                  </NavLink>
                </>
              ) : (
                <div className="dropdown-item disabled">
                  Acesso não autorizado
                </div>
              )}
            </div>
          </li>
        </div>
        <div className="login">
          {user ? (
            <div className="user-container">
              <div className="icon">
                <UserCircle size={26} color="#C6D6F3" />
                <div className="user-text">
                  <span>{user.nome || user.email || 'Usuário'}</span>
                </div>
              </div>
              <div className="login-button-container">
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="login-button">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
