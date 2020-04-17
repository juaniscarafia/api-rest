module.exports = app => {
    const Users = app.db.models.Users;

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
            Users.create(req.body)
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