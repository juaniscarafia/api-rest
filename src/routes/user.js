const bcrypt = require('bcryptjs');

module.exports = app => {
    const Users = app.db.models.Users;
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';
    const someOtherPlaintextPassword = 'not_bacon';

    app.route('/users/')
        .get((req,res) => {
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
            const hash = bcrypt.hashSync(myPlaintextPassword, salt);

            usr.password = hash;
            req.body.password = hash;
            
            Users.create(usr)
                .then(result => res.json(result))
                .catch(error =>{
                    res.status(412).json({msg: error.message});
                });
        });

    app.route('/users/:id')
        .get((req,res) => {
            Users.findByPk(req.params.id, {
                attributes: ['id','name','email']
            })
            .then(result => res.json(result))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        })
        .delete((req, res) => {
            Users.destroy({where: req.params})
            .then(result => res.sendStatus(204))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        });
}