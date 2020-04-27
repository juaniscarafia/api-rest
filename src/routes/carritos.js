module.exports = app => {
    const { Op } = require("sequelize");
    const Carritos = app.db.models.Carritos;
    const Productos = app.db.models.Productos;
    const CarritosProductos = app.db.models.CarritosProductos;
    const verifyToken = require('../libs/verifyToken');
    
    app.route('/Carrito/')
        .get(verifyToken, (req, res) => {
            Carritos.findAll({include: [{
                model: Productos
              }]})
            .then(result => res.json(result))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        })
        .post(verifyToken, (req, res) => {
            const carrito = req.body;
            
            Productos.findByPk(carrito.ProductoId, {
                attributes: ['Id', 'Nombre', 'Descripcion', 'Precio', 'Stock'],
                raw: true
            })
                .then(producto => {
                    Carritos.create(carrito)
                    .then(result => {
                        console.log(result.dataValues);
                        const cp = {
                            "CarritoId": result.dataValues.Id,
                            "ProductoId": carrito.ProductoId,
                            "Cantidad": 1
                        }
                        CarritosProductos.create(cp)
                        .then(carritoproducto => {
                            res.json({
                                msg: 'Carrito creado correctamente.'
                            });
                        })
                        .catch(error => {
                            res.status(412).json({msg: error.message});
                        });
                    })
                    .catch(error =>{
                        res.status(412).json({
                            Error: 'Error al crear el carrito.',
                            msg: error.message
                        });
                    });
                })
                .catch(error => {
                    res.status(412).json({msg: error.message});
                });
        });
    app.route('/Carrito/:Id')
        .get(verifyToken, (req, res) => {
            Carritos.findByPk(req.params.Id, {
                include: [{
                  model: Productos,
                }]
              })
            .then(result => res.json(result))
            .catch(error =>{
                res.status(412).json({msg: error.message});
            });
        })
        .delete(verifyToken, (req, res) => {
            Carritos.destroy({where: req.params})
            .then(result => {
                res.json({
                    msg: 'Carrito eliminado correctamente.'
                });
            })
            .catch(error => {
                res.status(412).json({
                    Error: 'Error al eliminar el carrito.',
                    msg: error.message
                });
            });
        });

    app.route('/CarritoProducto/')
        .post(verifyToken, (req, res) => {
            const productocarrito = req.body;
            CarritosProductos.create(productocarrito)
            .then(result => {
                res.json({
                    msg: 'Producto agregado al carrito correctamente.'
                });
            })
            .catch(error =>{
                res.status(412).json({
                    Error: 'Error al agregar el producto al carrito.',
                    msg: error.message
                });
            });
        });

    app.route('/CarritoProducto/:CarritoId/:ProductoId')
        .delete(verifyToken, (req, res) => {
            CarritosProductos.destroy({
                where: {
                    [Op.and]: [
                        { CarritoId: req.params.CarritoId },
                        { ProductoId: req.params.ProductoId }
                    ]
                }
            })
            .then(result => {
                console.log(result);
                if (result == 0)
                {
                    res.json({
                        msg: 'No se encontro el producto en el carrito.'
                    });
                }
                else {
                    res.json({
                        msg: 'Producto quitado del carrito.'
                    });
                }
            })
            .catch(error =>{
                res.status(412).json({
                    Error: 'Error al quitar el producto del carrito.',
                    msg: error.message
                });
            });
        });
};