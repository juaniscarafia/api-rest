const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const verifyToken = require('../libs/verifyToken');
    const config = require('../libs/configJWT');
    const Users = app.db.models.Users;

    app.route('/login/')
        .get((req, res, next) => {
            const _email = req.body.Email;
            const _password = req.body.Password;
            
            Users.findOne({
                attributes: ['Id', 'Email','Password'],
                where:{Email: _email},
                raw : true
            }).then(result => {
                const user = result;

                if (!user) {
                    return res.status(404).json('El email no existe');
                }
                
                const match = bcrypt.compareSync(_password, user.Password);
                
                if(!match) {
                    return res.status(401).json({
                        auth: false,
                        token: null
                    });
                }

                const token = jwt.sign({Id: user.Id}, config.secret, { expiresIn: 60 * 60 });

                res.json({
                    auth: true,
                    token
                });
            });
        });

    app.route('/profile/')
        .get(verifyToken, (req, res) => {
            Users.findByPk(req.user.Id, {
                attributes: ['Id','Name','Email']
            })
            .then(result => res.json(result))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        });
}