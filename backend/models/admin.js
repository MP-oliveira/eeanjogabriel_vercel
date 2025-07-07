const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../db/db');

const Admin = db.define('Admin', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin'),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100], // ajusta o segundo argumento conforme necessário
        msg: "A senha precisa ter ao menos 6 caracteres."
      }
    }
  }
  },
  {
    tableName: "admins",
    timestamps: false,
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      }
    }
  });

// Método para verificar senha
Admin.prototype.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Admin;
