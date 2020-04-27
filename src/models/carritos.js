module.exports = (sequelize, DataType) => {
    const Carritos = sequelize.define('Carritos', {
        Id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Precio: {
            type: DataType.REAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        SubTotal: {
            type: DataType.REAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        FechaAlta: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Estado: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Carritos.associate = (models) => {
        Carritos.belongsToMany(models.Productos, 
            { 
                through: 'CarritosProductos',
                foreignKey: 'CarritoId'
            });
    };

    return Carritos;
};