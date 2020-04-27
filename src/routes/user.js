const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const Users = app.db.models.Users;
    const saltRounds = 10;
    const verifyToken = require('../libs/verifyToken');
    const config = require('../libs/configJWT');

    app.route('/users/')
        .get(verifyToken, (req, res) => {
            Users.findAll({
                attributes: ['Id','Name','Email']
            })
                .then(result => res.json(result))
                .catch(error =>{
                    res.status(412).json({msg: error.message});
                });
        })
        .post((req, res) => {
            const usr = req.body;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(usr.Password, salt);

            usr.Password = hash;
            req.body.Password = hash;
            
            Users.create(usr)
                .then(result => {
                    const token = jwt.sign({d: usr.Id}, config.secret, {
                        expiresIn: 60 * 60
                    });
                    res.json({
                        auth: true,
                        token
                    });
                })
                .catch(error =>{
                    res.status(412).json({msg: error.message});
                });

            const token = jwt.sign({Id: usr.Id}, config.secret, {
                expiresIn: 60 * 60 * 24
            });
        });

    app.route('/users/:Id')
        .get(verifyToken, (req,res) => {
            Users.findByPk(req.params.Id, {
                attributes: ['Id','Name','Email']
            })
            .then(result => res.json(result))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        })
        .delete(verifyToken, (req, res) => {
            Users.destroy({where: req.params})
            .then(result => res.sendStatus(204))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        });
}