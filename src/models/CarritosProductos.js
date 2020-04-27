module.exports = (sequelize, DataType) => {
    const CarritosProductos = sequelize.define('CarritosProductos', {
        CarritoId: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: 'Carritos',
                key: 'id'
            }
        },
        ProductoId: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: 'Productos',
                key: 'id'
            }
        },
        Cantidad: {
            type: DataType.INTEGER,
            allowNull: false,
        }
    });

    CarritosProductos.associate = (models) => {
    
    };

    return CarritosProductos;
}