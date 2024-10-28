const db = require("../config/db");

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
};
