module.exports = (sequelize, DataType) => {
    const Productos = sequelize.define('Productos', {
        Id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Descripcion: {
            type: DataType.STRING,
            allowNull: true
        },
        Costo: {
            type: DataType.REAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        Precio: {
            type: DataType.REAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        Stock: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        Borrado: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    
    Productos.associate = (models) => {
        Productos.belongsToMany(models.Carritos, 
            { 
                through: 'CarritosProductos',
                foreignKey: 'ProductoId'
            });
    };
    
    return Productos;
};