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
                attributes: ['id','name','email']
            })
                .then(result => res.json(result))
                .catch(error =>{
                    res.status(412).json({msg: error.message});
                });
        })
        .post((req, res) => {
            const usr = req.body;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(usr.password, salt);

            usr.password = hash;
            req.body.password = hash;
            
            Users.create(usr)
                .then(result => {
                    const token = jwt.sign({id: usr.id},config.secret,{
                        expiresIn: 60 * 60
                    });
                    res.json({
                        auth: true,
                        token,
                        user: result
                    });
                })
                .catch(error =>{
                    res.status(412).json({msg: error.message});
                });

            const token = jwt.sign({id: usr.id},'pepebolas',{
                expiresIn: 60 * 60 * 24
            });
        });

    app.route('/users/:id')
        .get(verifyToken, (req,res) => {
            Users.findByPk(req.params.id, {
                attributes: ['id','name','email']
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