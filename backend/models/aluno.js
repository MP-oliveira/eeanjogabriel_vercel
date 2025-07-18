const { DataTypes } = require('sequelize');
const db = require('../db/db');
const Curso = require('../models/curso') 
const Turno = require('../models/turno') 

const Aluno = db.define('Aluno', {
  nome: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  data_nascimento: {
    // ajustar pra DATE depois 
    type: DataTypes.STRING,
    // allowNull: false,
  },
  estado_civil: {
    type: DataTypes.STRING,
  },
  naturalidade: {
    type: DataTypes.STRING,
  },
  nacionalidade: {
    type: DataTypes.STRING,
  },
  pai: {
    type: DataTypes.STRING,
  },
  mae: {
    type: DataTypes.STRING,
  },

  cpf: {
    type: DataTypes.STRING(11),
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
  },
  n_casa: {
    type: DataTypes.STRING(10),
  },
  bairro: {
    type: DataTypes.STRING,
  },

  celular: {
    type: DataTypes.STRING(15),
  },

  cep: {
    type: DataTypes.STRING(10),
  },
  cidade: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.STRING,
  },
  curso_id: { // relacionar com tabela curso
    type: DataTypes.INTEGER,
  },
  turno_id: { // relacionar com tabela curso
    type: DataTypes.INTEGER,
  },
  foto_url: {
    type: DataTypes.STRING,
  },
  historico_url: {
    type: DataTypes.STRING,
  },
  data_matricula: {
    // quando colocar curso pra funcionar mudar para date
    type: DataTypes.STRING,
  },
   data_termino_curso: {
    type: DataTypes.STRING,
   },
},
{
  tableName: "alunos"
});




Curso.hasMany(Aluno, { foreignKey: 'curso_id' });
Aluno.belongsTo(Curso, { foreignKey: 'curso_id' });

Turno.hasMany(Aluno, { foreignKey: 'turno_id' });
Aluno.belongsTo(Turno, { foreignKey: 'turno_id' });


module.exports = Aluno;

