const db = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = {
  async listarUsuarios(req, res) {
    try {
      const sql = `select * from usuarios`;

      const resposta = await db.query(sql);

      return res.status(200).json({
        sucesso: true,
        mensagem: "Usuarios listados com sucesso",
        dados: resposta.rows,
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mesagem: "Erro ao listar usuarios",
        dados: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const sql = `select * from usuarios where email = $1 and senha = $2`;

      const resposta = await db.query(sql, [email, senha]);

      if (resposta.rows.length > 0) {
        return res.status(200).json({
          sucesso: true,
          mensagem: "Login realizado com sucesso",
          dados: resposta.rows,
        });
      }
      if (resposta.rows.length === 0) {
        return res
          .status(401)
          .json({ sucesso: false, mensagem: "E-mail ou senha inválidos" });
      }
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mesagem: "Erro ao realizar login",
        dados: error.message,
      });
    }
  },

  async cadastrar(req, res) {
    try {
      const { nome_usu, email_usu, senha_usu } = req.body;

      //gera o hash da senha
      const saltRounds = 10; // numeros de rounds para aumentar a seguranca
      const hashedPassword = await bcrypt.hash(senha_usu, saltRounds);

      //insere o usuario no banco de dados
      const sql = `insert into usuarioTeste(nome_usu, email_usu, senha_usu) values ($1, $2, $3)`;
      const resposta = await db.query(sql, [
        nome_usu,
        email_usu,
        hashedPassword,
      ]);

      res.status(201).json({
        sucesso: true,
        mensagem: "Usuario cadastrado com sucesso",
        dados: resposta.rows,
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mesagem: "Erro ao cadastrar usuario",
        dados: error.message,
      });
    }
  },
};
