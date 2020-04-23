const bcrypt = require('bcryptjs');

module.exports = app => {
    const Users = app.db.models.Users;

    app.route('/login/')
        .get((req, res, next) => {
            const _email = req.body.email;
            const _password = req.body.password;
            
            Users.findOne({
                attributes: ['email','password'],
                where:{email: _email},
                raw : true
            }).then(result => {
                const user = result;

                if (!user) {
                    return res.status(404).json('El email no existe');
                }
                
                const match = bcrypt.compareSync(_password, user.password);
                
                if(match) {
                    res.json({
                        auth: true,
                        message: "Usuario Logueado",
                    });
                }
                else {
                    res.json({
                        auth: false,
                        message: "Usuario No Logueado",
                    });
                }
            });
        });
}