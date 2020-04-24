module.exports = app => {
    const Productos = app.db.models.Productos;
    const verifyToken = require('../libs/verifyToken');
    const config = require('../libs/configJWT');

    app.route('/Productos/')
        .get(verifyToken, (req, res) => {
            Productos.findAll({
                attributes: ['id', 'Nombre', 'Descripcion', 'Precio', 'Stock']
            })
            .then(result => res.json(result))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        })
        .post(verifyToken, (req, res) => {
            const producto = req.body;
            Productos.create(producto)
                .then(result => {
                    res.json({
                        msg: 'Producto creado correctamente.',
                        Producto: {
                            id: result.id
                        }
                    });
                })
                .catch(error =>{
                    res.status(412).json({
                        Error: 'Error al crear producto.',
                        msg: error.message
                    });
                });
        });
    app.route('/Productos/:id')
        .get(verifyToken, (req, res) => {
            Productos.findByPk(req.params.id, {
                attributes: ['id', 'Nombre', 'Descripcion', 'Precio', 'Stock']
            })
                .then(result => res.json(result))
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        })
        .delete(verifyToken, (req, res) => {
            Productos.destroy({where: req.params})
                .then(result => {
                    res.json({
                        msg: 'Producto borrado correctamente.'
                    });
                })
                .catch(error => {
                    res.status(412).json({
                        Error: 'Error al borrar producto.',
                        msg: error.message
                    });
                });
        })
        .put((req, res) => {
            Productos.update(req.body, {where: req.params})
                .then(result => {
                    console.log(result);
                    res.json({
                        msg: 'Producto modificado correctamente.'
                    });
                })
                .catch(error => {
                    res.status(412).json({
                        Error: 'Error al modificar el producto.',
                        msg: error.message
                    });
                });
        });
};