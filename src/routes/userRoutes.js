const express = require("express");
const userController = require("../controllers/usuarios");

const router = express.Router();

router.get("/usuarios", userController.listarUsuarios);
router.post("/login", userController.login);
router.post("/usuarios", userController.cadastrar);

module.exports = router;
