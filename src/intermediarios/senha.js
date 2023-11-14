const verificarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha não foi informada" });
    };

    if (senha_banco !== "Cubos123Bank") {
        return res.status(401).json("A senha está incorreta");
    };
    
    next();
}

module.exports = { verificarSenha };