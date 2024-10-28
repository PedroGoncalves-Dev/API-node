const express = require("express");
const userController = require("../controllers/usuarios");

const router = express.Router();

router.get("/usuarios", userController.listarUsuarios);

module.exports = router;
