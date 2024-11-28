const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.API_KEY_SENDGRID);

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
      const { email_usu, senha_usu } = req.body;

      const sql = `SELECT * from usuarioTeste where email_usu = $1`;
      const resposta = await db.query(sql, [email_usu]);

      //verifica se o uusuario existe
      if (resposta.rows.length === 0) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Email ou senha incorretos",
          dados: null,
        });
      }

      const user = resposta.rows[0]; //pega os dados do usuario retornado

      //verifica a senha e compara com bcrypt hash
      const senhaValida = await bcrypt.compare(senha_usu, user.senha_usu);

      if (!senhaValida) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Email ou senha incorretos",
          dados: null,
        });
      }

      //gera o token pro usuairo logado
      const token = jwt.sign(
        { id_usu: user.id_usu, email_usu: user.email_usu },
        SECRET_KEY,
        {
          expiresIn: "1h", //token valido por 1hora
        }
      );

      return res.status(200).json({
        sucesso: true,
        mensagem: "Login realizado com sucesso",
        dados: [token, user],
      });
    } catch (error) {
      return res.status(500).json({
        secuesso: false,
        mensagem: "Erro ao realizar login",
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

      const msg = {
        to: email_usu,
        from: "pedrohenrique040497@outlook.com", // Certifique-se que este email foi verificado no SendGrid
        subject: "Bem-vindo ao nosso sistema!",
        text: `Olá ${nome_usu},\n\nObrigado por se cadastrar no nosso sistema! Estamos felizes em tê-lo conosco.`,
      };

      try {
        await sgMail.send(msg);
        console.log("E-mail enviado com sucesso!");
      } catch (error) {
        console.error(
          "Erro ao enviar e-mail:",
          error.response?.body || error.message
        );
      }

      return res.status(201).json({
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
