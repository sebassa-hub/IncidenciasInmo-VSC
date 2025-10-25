const db = require('../config/dbconfig');

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Consulta para buscar usuario y su rol
            const sql = `
                SELECT u.IdUsuario, u.Username, u.PasswordHash, u.Email, u.Estado,
                p.IdPropietario, p.Nombre, p.Documento, p.Telefono,
                r.IdRol, r.Nombre as RolNombre
                FROM usuario u
                INNER JOIN rol r ON u.IdRol = r.IdRol
                LEFT JOIN propietario p ON u.IdPropietario = p.IdPropietario
                WHERE u.Email = ? AND u.Estado = 1
            `;

            db.query(sql, [email], async (err, results) => {
                if (err) {
                    console.error('Error en consulta:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error del servidor' 
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Usuario no encontrado o inactivo' 
                    });
                }

                const usuario = results[0];

                // Comparación directa de contraseña
                const passwordValido = (password === usuario.PasswordHash);

                if (!passwordValido) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Contraseña incorrecta' 
                    });
                }

                // Login exitoso - incluir el rol en la respuesta
                res.json({
                    success: true,
                    message: 'Login exitoso',
                    user: {
                        id: usuario.IdUsuario,
                        nombre: usuario.Nombre,
                        email: usuario.Email,
                        rol: usuario.RolNombre, // ← Esto es importante
                        idPropietario: usuario.IdPropietario,
                        documento: usuario.Documento,
                        telefono: usuario.Telefono
                    }
                });
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
            });
        }
    }
};