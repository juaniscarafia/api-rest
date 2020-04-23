const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = app => {
    const Users = app.db.models.Users;
    const saltRounds = 10;

    app.route('/users/')
        .get((req,res) => {
            const token = req.headers['x-access-token'];
            if (!token){
                return res.status(401).json({
                    auth: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token,'pepebolas');

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
                    const token = jwt.sign({id: usr.id},'pepebolas',{
                        expiresIn: 60 * 60 * 24
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
        .get((req,res) => {
            const token = req.headers['x-access-token'];
            if (!token){
                return res.status(401).json({
                    auth: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token,'pepebolas');

            Users.findByPk(req.params.id, {
                attributes: ['id','name','email']
            })
            .then(result => res.json(result))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        })
        .delete((req, res) => {
            const token = req.headers['x-access-token'];
            if (!token){
                return res.status(401).json({
                    auth: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token,'pepebolas');

            Users.destroy({where: req.params})
            .then(result => res.sendStatus(204))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        });
}