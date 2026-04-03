export const checRole = (...allowedRoles) => (req, res, next) => {
    if(!req.user){
        return res.status(401).json({ error: "Não autenticado" });
    }
    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({ error: "Acesso negado. Permissão insuficiente" });
    }
}

export const isAdmin = checRole("ADMIN");